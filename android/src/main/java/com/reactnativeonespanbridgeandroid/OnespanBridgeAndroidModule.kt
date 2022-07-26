package com.reactnativeonespanbridgeandroid

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.reactnativeonespanbridgeandroid.settings.SessionHelper

class OnespanBridgeAndroidModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "OnespanBridgeAndroid"

  @ReactMethod
  fun setAccountIdentifier(
    accountIdentifier: String,
    cloudServerUrl: String
  ) {
    // start koin modules
//    currentActivity?.application?.let { start(it) }

    // set session helper parameters
    SessionHelper.apply {
      this.accountIdentifier = accountIdentifier
      this.cloudServerUrl = cloudServerUrl
    }
  }

  @ReactMethod
  fun startActivation(userId: String, userPassword: String) {
    val activity = currentActivity

//    val intent = Intent(activity, ActivationActivity::class.java).apply {
//      putExtra("userId", userId)
//      putExtra("userPassword", userPassword)
//    }
//
//    activity?.startActivity(intent)
  }

  @ReactMethod
  fun addListener(eventName: String) {
//    val errorListener = ActivationActivity.statusListener

    /*try {
      errorListener.onStatusListener = {
        val params = Arguments.createMap().apply { putString("status", it) }
        sendEvent(reactContext, eventName, params)
      }
    } catch (e: Throwable) {
      Log.e("addListener", "Throwable: $e")
    }*/
  }

  @ReactMethod
  fun removeListeners(count: Int) {
    // Remove upstream listeners, stop unnecessary background tasks
    Log.d("removeListeners", "removeListeners: $count")
  }

  private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap?) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }
}
