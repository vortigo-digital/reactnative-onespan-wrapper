package com.reactnativeonespanbridgeandroid

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.reactnativeonespanbridgeandroid.activation.OSActivationModule
import com.reactnativeonespanbridgeandroid.notification.OSRegisterNotificationModule
import com.reactnativeonespanbridgeandroid.settings.OSSettingsModule

class OnespanBridgeAndroidPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(
      OSSettingsModule(reactContext),
      OSActivationModule(reactContext),
      OSRegisterNotificationModule(reactContext)
    )
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return emptyList()
  }
}
