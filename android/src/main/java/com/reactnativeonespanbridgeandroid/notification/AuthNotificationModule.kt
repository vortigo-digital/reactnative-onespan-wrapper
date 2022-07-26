package com.reactnativeonespanbridgeandroid.notification

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.vasco.orchestration.client.flows.PasswordError
import com.vasco.orchestration.client.flows.remote_authentication.RemoteAuthenticationCallback

class AuthNotificationModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext), RemoteAuthenticationCallback {

  override fun getName() = "AuthNotificationModule"

  override fun onRemoteAuthenticationDisplayData(
    p0: String?,
    p1: RemoteAuthenticationCallback.DisplayDataCaller?
  ) {
    TODO("Not yet implemented")
  }

  override fun onRemoteAuthenticationStepComplete(p0: String?) {
    TODO("Not yet implemented")
  }

  override fun onRemoteAuthenticationSuccess(p0: RemoteAuthenticationCallback.SuccessSessionState?) {
    TODO("Not yet implemented")
  }

  override fun onRemoteAuthenticationSessionOutdated(p0: RemoteAuthenticationCallback.SessionOutdatedReason?) {
    TODO("Not yet implemented")
  }

  override fun onRemoteAuthenticationAborted() {
    TODO("Not yet implemented")
  }

  override fun onRemoteAuthenticationPasswordError(p0: PasswordError?) {
    TODO("Not yet implemented")
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
