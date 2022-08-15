package com.reactnativeonespanbridgeandroid.settings

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.reactnativeonespanbridgeandroid.utils.SharedPreferencesStorage

class OSSettingsModule(
  reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "OSSettingsModule"

  private val storage = SharedPreferencesStorage(reactContext)

  @ReactMethod
  fun setSettings(
    domainIdentifier: String,
    saltStorage: String,
    saltDigipass: String,
    mainActivityPath: String,
    promise: Promise
  ) {
    try {
      SessionHelper.apply {
        this.domainIdentifier = domainIdentifier
        this.saltStorage = saltStorage
        this.saltDigipass = saltDigipass
      }

      storage.storageMainActivityPath(mainActivityPath)

      promise.resolve("success")

    } catch (e: Exception) {
      promise.reject(e)
    }
  }
}
