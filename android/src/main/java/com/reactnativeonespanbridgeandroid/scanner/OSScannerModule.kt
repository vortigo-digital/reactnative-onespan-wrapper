package com.reactnativeonespanbridgeandroid.scanner

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.vasco.digipass.sdk.utils.qrcodescanner.QRCodeScannerSDKConstants
import com.vasco.digipass.sdk.utils.qrcodescanner.QRCodeScannerSDKException

class OSScannerModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext), ActivityCompat.OnRequestPermissionsResultCallback {

  override fun getName() = "OSScannerModule"

  private lateinit var scannerPromise: Promise

  @ReactMethod
  fun scanQrCode(promise: Promise) {
    scannerPromise = promise
    OSScannerModule.scannerPromise = promise

    launchSDKScanner()
  }

  private fun launchSDKScanner() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP_MR1) {
      // "System Camera sample could only work with Android 5.1 or higher"
      Log.e(name, "System Camera sample could only work with Android 5.1 or higher")
    }

    if (allPermissionsGranted()) startScannerActivity()
    else requestPermissions()   // return promise.reject
  }

  private fun startScannerActivity() {
    val intent = Intent(reactContext.currentActivity, QRCodeScannerActivity::class.java)
    reactContext.currentActivity?.startActivityForResult(intent, CAMERA_ACTIVITY_REQUEST_CODE)
  }

  private fun allPermissionsGranted() = ContextCompat.checkSelfPermission(
    reactContext,
    REQUIRED_PERMISSION
  ) == PackageManager.PERMISSION_GRANTED

  private fun requestPermissions() {
    if (reactContext.currentActivity != null) {

      ActivityCompat.requestPermissions(
        reactContext.currentActivity!!,
        arrayOf(REQUIRED_PERMISSION),
        ACCESS_CAMERA_REQUEST_CODE
      )

    }
  }

  override fun onRequestPermissionsResult(
    requestCode: Int,
    permissions: Array<out String>,
    grantResults: IntArray
  ) {
    if (requestCode == ACCESS_CAMERA_REQUEST_CODE) startScannerActivity()
  }

  companion object {
    private const val REQUIRED_PERMISSION = Manifest.permission.CAMERA
    const val ACCESS_CAMERA_REQUEST_CODE = 1
    const val CAMERA_ACTIVITY_REQUEST_CODE = 2

    lateinit var scannerPromise: Promise

    fun activityResult(requestCode: Int, resultCode: Int, data: Intent?) {
      Log.d("FLMWG", "requestCode: $requestCode , resultCode: $resultCode")

      when(resultCode) {

        Activity.RESULT_OK -> {
          val scannedImageFormat = data?.getIntExtra(QRCodeScannerSDKConstants.OUTPUT_CODE_TYPE, 0)
          val scannedImageData = data?.getStringExtra(QRCodeScannerSDKConstants.OUTPUT_RESULT)
          val format = if (scannedImageFormat == QRCodeScannerSDKConstants.CRONTO_CODE) "Cronto Sign" else "QR Code"

          Log.d("FLMWG", "Scanned image data = $scannedImageData")
          scannerPromise.resolve(scannedImageData)
        }

        Activity.RESULT_CANCELED -> {
          Log.e("FLMWG", "Scanned canceled")
          scannerPromise.reject("canceled","Scanned canceled")
        }

        QRCodeScannerSDKConstants.RESULT_ERROR -> {
          val exception = data?.getSerializableExtra(QRCodeScannerSDKConstants.OUTPUT_EXCEPTION) as QRCodeScannerSDKException?
//          onExceptionThrown(exception)
          Log.e("FLMWG", "Scanned exception = ${exception?.message}")
          scannerPromise.reject("exception","${exception?.message}")
        }

      }
    }

  }
}
