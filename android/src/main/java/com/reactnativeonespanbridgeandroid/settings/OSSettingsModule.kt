package com.reactnativeonespanbridgeandroid.settings

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class OSSettingsModule(
  reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "OSSettingsModule"

  @ReactMethod
  fun setSettings(
    accountIdentifier: String,
    cloudServerUrl: String,
    saltStorage: String,
    saltDigipass: String,
    promise: Promise
  ) {
    try {
      SessionHelper.apply {
        this.accountIdentifier = accountIdentifier
        this.cloudServerUrl = cloudServerUrl
        this.saltStorage = saltStorage
        this.saltDigipass = saltDigipass
      }
      promise.resolve("success")

    } catch (e: Exception) {
      promise.reject(e.cause)
    }
  }
}
