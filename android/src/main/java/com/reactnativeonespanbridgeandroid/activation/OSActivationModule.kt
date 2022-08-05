package com.reactnativeonespanbridgeandroid.activation

import android.util.Log
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.reactnativeonespanbridgeandroid.settings.SessionHelper
import com.reactnativeonespanbridgeandroid.utils.CDDCUtils
import com.reactnativeonespanbridgeandroid.utils.SharedPreferencesStorage
import com.vasco.orchestration.client.Orchestrator
import com.vasco.orchestration.client.errors.*
import com.vasco.orchestration.client.flows.activation.online.OnlineActivationCallback
import com.vasco.orchestration.client.flows.activation.online.OnlineActivationInputError
import com.vasco.orchestration.client.flows.activation.online.OnlineActivationParams
import com.vasco.orchestration.client.user.OrchestrationUser
import java.lang.ref.WeakReference

class OSActivationModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext),
  OnlineActivationCallback,
  OrchestrationWarningCallback,
  OrchestrationErrorCallback {

  override fun getName() = "OSActivationModule"

  private lateinit var orchestrator: Orchestrator
  private lateinit var activationPromise: Promise
  private val storage = SharedPreferencesStorage(reactContext)
  private var userID = ""

  @ReactMethod
  fun activate(
    userIdentifier: String,
    activationPassword: String,
    promise: Promise
  ) {
    activationPromise = promise
    userID = userIdentifier

    reactContext.currentActivity?.let { currentActivity ->

      orchestrator = Orchestrator.Builder()
        .setDigipassSalt(SessionHelper.saltDigipass)
        .setStorageSalt(SessionHelper.saltStorage)
        .setContext(currentActivity)
        .setActivityProvider { WeakReference(currentActivity as FragmentActivity) }
        .setDefaultDomain(SessionHelper.domain)
        .setCDDCParams(CDDCUtils.getCDDCParams())
        .setErrorCallback(this)
        .setWarningCallback(this)
        .build()

      CDDCUtils.configure(orchestrator.cddcDataFeeder)

      val activationParams = OnlineActivationParams()
      activationParams.setActivationCallback(this)
      activationParams.orchestrationUser = OrchestrationUser(userIdentifier)
      activationParams.activationPassword = activationPassword

      orchestrator.startActivation(activationParams)
    }
  }

  override fun onActivationSuccess() {
    Log.d(name, "onActivationSuccess")

    storage.setCurrentUser(userID)
    activationPromise.resolve("success")
  }

  override fun onActivationInputError(error: OnlineActivationInputError?) {
    Log.e(name, "onActivationInputError code: ${error?.errorCode}")

    activationPromise.reject("errorCode", "${error?.errorCode}")
  }

  override fun onActivationAborted() {
    Log.e(name, "onActivationAborted")

    activationPromise.reject("onActivationAborted", "onActivationAborted")
  }

  override fun onActivationStepComplete(command: String?) {
    Log.d(name, "onActivationStepComplete / command: $command")

    activationPromise.resolve(command)
  }

  @ReactMethod
  fun execute(command: String, promise: Promise) {
    Log.d(name, "execute command: $command")

    activationPromise = promise
    orchestrator.execute(command)
  }

  override fun onOrchestrationWarning(warning: OrchestrationWarning?) {
    Log.w(name, "onOrchestrationWarning, code:${warning?.warningCode} / exception:${warning?.exception}")

    //    activationPromise.reject("warningCode", "${warning?.warningCode}")
  }

  override fun onOrchestrationError(error: OrchestrationError?) {
    Log.e(name, "onOrchestrationError, code:${error?.errorCode} / exception:${error?.exception}")

    activationPromise.reject("errorCode", "${error?.errorCode}")
  }

  override fun onOrchestrationServerError(error: OrchestrationServerError?) {
    Log.e(name, "onOrchestrationServerError, customPayload:${error?.readableMessage}")

    //    activationPromise.reject("serverError", "${error?.customPayload}")
  }
}
