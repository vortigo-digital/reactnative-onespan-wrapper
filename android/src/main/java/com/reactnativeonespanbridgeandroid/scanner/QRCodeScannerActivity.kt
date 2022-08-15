package com.reactnativeonespanbridgeandroid.scanner

import android.content.Intent
import android.os.*
import androidx.appcompat.app.AppCompatActivity
import com.reactnativeonespanbridgeandroid.R
import com.reactnativeonespanbridgeandroid.scanner.OSScannerModule.Companion.ACCESS_CAMERA_REQUEST_CODE
import com.reactnativeonespanbridgeandroid.scanner.QRCodeScannerFragment.Companion.newInstance
import com.reactnativeonespanbridgeandroid.scanner.QRCodeScannerFragment.ImageDecoderListener
import com.vasco.digipass.sdk.utils.qrcodescanner.QRCodeScannerSDKConstants

class QRCodeScannerActivity : AppCompatActivity(), ImageDecoderListener {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_qrcode_scanner)

    if (savedInstanceState == null) {
      supportFragmentManager.beginTransaction()
        .replace(R.id.fragment_container, newInstance())
        .commit()
    }
  }

  override fun onImageScanned(scannedImageFormat: Int, scannedImageData: String) {
    /*val vibrator = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      vibrator.vibrate(VibrationEffect.createOneShot(100, VibrationEffect.DEFAULT_AMPLITUDE))

    } else {
      vibrator.vibrate(100)
    }*/

    val intent = Intent()
    intent.putExtra(QRCodeScannerSDKConstants.OUTPUT_RESULT, scannedImageData)
    intent.putExtra(QRCodeScannerSDKConstants.OUTPUT_CODE_TYPE, scannedImageFormat)

//    setResult(RESULT_OK, intent)
    setActivityResult(RESULT_OK, intent)

    finish()
  }

  override fun onExceptionThrown(e: Throwable) {
    val intent = Intent()
    intent.putExtra(QRCodeScannerSDKConstants.OUTPUT_EXCEPTION, e)
//    setResult(QRCodeScannerSDKConstants.RESULT_ERROR, intent)
    setActivityResult(QRCodeScannerSDKConstants.RESULT_ERROR, intent)
    finish()
  }

  override fun onBackPressed() {
    super.onBackPressed()
    onScanCancelled()
  }

  private fun onScanCancelled() {
//    setResult(RESULT_CANCELED)
    setActivityResult(RESULT_CANCELED, null)
    finish()
  }

  private fun setActivityResult(resultCode: Int, data: Intent?) {
    OSScannerModule.activityResult(ACCESS_CAMERA_REQUEST_CODE, resultCode, data)
  }
}
