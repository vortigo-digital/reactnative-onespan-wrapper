package com.reactnativeonespanbridgeandroid.scanner

import android.annotation.SuppressLint
import android.content.Context
import android.hardware.display.DisplayManager
import android.os.Bundle
import android.util.DisplayMetrics
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.content.ContextCompat
import com.reactnativeonespanbridgeandroid.R
import com.vasco.digipass.sdk.utils.qrcodescanner.QRCodeScannerSDK
import com.vasco.digipass.sdk.utils.qrcodescanner.QRCodeScannerSDKConstants
import java.lang.RuntimeException
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min

class QRCodeScannerFragment : Fragment() {

  var listener: ImageDecoderListener? = null

  private lateinit var container: FrameLayout
  private lateinit var viewFinder: PreviewView

  private var displayId: Int = -1
  private var lensFacing: Int = CameraSelector.LENS_FACING_BACK
  private var preview: Preview? = null
  private var imageAnalyzer: ImageAnalysis? = null
  private var camera: Camera? = null
  private var cameraProvider: ProcessCameraProvider? = null

  private var imageScanned = false

  private val displayManager by lazy {
    requireContext().getSystemService(Context.DISPLAY_SERVICE) as DisplayManager
  }

  /** Blocking camera operations are performed using this executor */
  private lateinit var cameraExecutor: ExecutorService

  /**
   * We need a display listener for orientation changes that do not trigger a configuration
   * change, for example if we choose to override config change in manifest or for 180-degree
   * orientation changes.
   */
  private val displayListener = object : DisplayManager.DisplayListener {
    override fun onDisplayAdded(displayId: Int) = Unit
    override fun onDisplayRemoved(displayId: Int) = Unit
    override fun onDisplayChanged(displayId: Int) = view?.let { view ->
      if (displayId == this@QRCodeScannerFragment.displayId) {
        Log.d(TAG, "Rotation changed: ${view.display.rotation}")
        imageAnalyzer?.targetRotation = view.display.rotation
      }
    } ?: Unit
  }

  override fun onAttach(context: Context) {
    super.onAttach(context)

    if (context is ImageDecoderListener) listener = context
    else throw RuntimeException("$context must implement ImageDecoderListener")
  }

  override fun onCreateView(
    inflater: LayoutInflater, container: ViewGroup?,
    savedInstanceState: Bundle?
  ): View? = inflater.inflate(R.layout.fragment_qr_code_scanner, container, false)

  @SuppressLint("MissingPermission")
  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)

    container = view as FrameLayout
    viewFinder = container.findViewById(R.id.view_finder)

    // Initialize our background executor
    cameraExecutor = Executors.newSingleThreadExecutor()
    // Every time the orientation of device changes, update rotation for use cases
    displayManager.registerDisplayListener(displayListener, null)

    // Wait for the views to be properly laid out
    viewFinder.post {
      // Keep track of the display in which this view is attached
      displayId = viewFinder.display.displayId
      // Set up the camera and its use cases
      setUpCamera()
    }
  }

  /** Initialize CameraX, and prepare to bind the camera use cases  */
  private fun setUpCamera() {
    val cameraProviderFuture = ProcessCameraProvider.getInstance(requireContext())

    cameraProviderFuture.addListener(
      Runnable {
        // CameraProvider
        cameraProvider = cameraProviderFuture.get()

        // Select lensFacing depending on the available cameras
        lensFacing = when {
          hasBackCamera() -> CameraSelector.LENS_FACING_BACK
          hasFrontCamera() -> CameraSelector.LENS_FACING_FRONT
          else -> throw IllegalStateException("Back and front camera are unavailable")
        }

        // Build and bind the camera use cases
        bindCameraUseCases()
      },
      ContextCompat.getMainExecutor(requireContext())
    )
  }

  /** Declare and bind preview, capture and analysis use cases */
  private fun bindCameraUseCases() {
    // Get screen metrics used to setup camera for full screen resolution
    val metrics = DisplayMetrics().also { viewFinder.display.getRealMetrics(it) }
    Log.d(TAG, "Screen metrics: ${metrics.widthPixels} x ${metrics.heightPixels}")

    val screenAspectRatio = aspectRatio(metrics.widthPixels, metrics.heightPixels)
    Log.d(TAG, "Preview aspect ratio: $screenAspectRatio")

    val rotation = viewFinder.display.rotation

    // CameraProvider
    val cameraProvider =
      cameraProvider ?: throw IllegalStateException("Camera initialization failed.")

    // CameraSelector
    val cameraSelector = CameraSelector.Builder().requireLensFacing(lensFacing).build()

    // Preview
    preview = Preview.Builder()
      // We request aspect ratio but no resolution
      .setTargetAspectRatio(screenAspectRatio)
      // Set initial target rotation
      .setTargetRotation(rotation)
      .build()

    // ImageAnalysis
    imageAnalyzer = ImageAnalysis.Builder()
      // We request aspect ratio but no resolution
      .setTargetAspectRatio(screenAspectRatio)
      // Set initial target rotation, we will have to call this again if rotation changes
      // during the lifecycle of this use case
      .setTargetRotation(rotation)
      .build()
      // The analyzer can then be assigned to the instance
      .also {
        it.setAnalyzer(cameraExecutor, QrCodeAnalyzer())
      }

    // Must unbind the use-cases before rebinding them
    cameraProvider.unbindAll()

    try {
      // A variable number of use-cases can be passed here -
      // camera provides access to CameraControl & CameraInfo
      camera = cameraProvider.bindToLifecycle(this, cameraSelector, preview, imageAnalyzer)

      // Attach the viewfinder's surface provider to preview use case
      preview?.setSurfaceProvider(viewFinder.surfaceProvider)

    } catch (exc: Exception) {
      Log.e(TAG, "Use case binding failed", exc)
    }
  }

  /**
   *  [androidx.camera.core.ImageAnalysisConfig] requires enum value of
   *  [androidx.camera.core.AspectRatio]. Currently it has values of 4:3 & 16:9.
   *
   *  Detecting the most suitable ratio for dimensions provided in @params by counting absolute
   *  of preview ratio to one of the provided values.
   *
   *  @param width - preview width
   *  @param height - preview height
   *  @return suitable aspect ratio
   */
  private fun aspectRatio(width: Int, height: Int): Int {
    val previewRatio = max(width, height).toDouble() / min(width, height)

    if (abs(previewRatio - RATIO_4_3_VALUE) <= abs(previewRatio - RATIO_16_9_VALUE)) {
      return AspectRatio.RATIO_4_3
    }

    return AspectRatio.RATIO_16_9
  }

  /** Returns true if the device has an available back camera. False otherwise */
  private fun hasBackCamera(): Boolean {
    return cameraProvider?.hasCamera(CameraSelector.DEFAULT_BACK_CAMERA) ?: false
  }

  /** Returns true if the device has an available front camera. False otherwise */
  private fun hasFrontCamera(): Boolean {
    return cameraProvider?.hasCamera(CameraSelector.DEFAULT_FRONT_CAMERA) ?: false
  }

  override fun onDetach() {
    super.onDetach()

    listener = null
  }

  override fun onDestroyView() {
    super.onDestroyView()

    // Shut down our background executor
    cameraExecutor.shutdown()

    // Unregister listeners
    displayManager.unregisterDisplayListener(displayListener)
  }

  interface ImageDecoderListener {
    fun onImageScanned(scannedImageFormat: Int, scannedImageData: String)
    fun onExceptionThrown(e: Throwable)
  }

  /**
   * Decodes the current {@link Image} using {@link QRCodeScannerSDK}.
   */
  inner class QrCodeAnalyzer : ImageAnalysis.Analyzer {
    /**
     * Analyzes an image to produce a result.
     *
     * <p>The caller is responsible for ensuring this analysis method can be executed quickly
     * enough to prevent stalls in the image acquisition pipeline. Otherwise, newly available
     * images will not be acquired and analyzed.
     *
     * <p>The image passed to this method becomes invalid after this method returns. The caller
     * should not store external references to this image, as these references will become
     * invalid.
     *
     * @param image image being analyzed VERY IMPORTANT: Analyzer method implementation must
     * call image.close() on received images when finished using them. Otherwise, new images
     * may not be received or the camera may stall, depending on back pressure setting.
     *
     */
    @ExperimentalGetImage
    override fun analyze(image: ImageProxy) {

      if (!imageScanned && image.image != null) {

        try {

          val decodingResultData: QRCodeScannerSDK.QRCodeScannerSDKDecodingResultData =
            QRCodeScannerSDK.decodeImage(
              image.image,
              QRCodeScannerSDKConstants.QR_CODE + QRCodeScannerSDKConstants.CRONTO_CODE
            )

          val scannedImageFormat: Int = decodingResultData.scannedImageFormat
          val scannedImageData: String? = decodingResultData.scannedImageData

          if (scannedImageFormat != -1 && scannedImageData != null) {
            imageScanned = true
            listener?.onImageScanned(scannedImageFormat, scannedImageData)
          }

        } catch (e: java.lang.Exception) {
          listener?.onExceptionThrown(e)
        }

      }

      image.close()
    }
  }

  companion object {
    @JvmStatic
    fun newInstance() = QRCodeScannerFragment()

    private const val TAG = "CameraXBasic"
    private const val RATIO_4_3_VALUE = 4.0 / 3.0
    private const val RATIO_16_9_VALUE = 16.0 / 9.0
  }
}
