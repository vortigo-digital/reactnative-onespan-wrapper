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
  reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext),
  OnlineActivationCallback,
  OrchestrationWarningCallback,
  OrchestrationErrorCallback {

  override fun getName() = "OSActivationModule"

  private var orchestrator: Orchestrator? = null

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

    val localOrchestrator = getOrchestrator()

    CDDCUtils.configure(localOrchestrator.cddcDataFeeder)

    val activationParams = OnlineActivationParams()
    activationParams.setActivationCallback(this)
    activationParams.orchestrationUser = OrchestrationUser(userIdentifier)
    activationParams.activationPassword = activationPassword

    localOrchestrator.startActivation(activationParams)

  }

  private fun getOrchestrator(): Orchestrator {

    var instanceOrchestration = orchestrator

    if (instanceOrchestration == null) {

      instanceOrchestration = Orchestrator.Builder()
        .setDigipassSalt(SessionHelper.saltDigipass)
        .setStorageSalt(SessionHelper.saltStorage)
        .setContext(currentActivity)
        .setActivityProvider { WeakReference(currentActivity as FragmentActivity) }
        .setDefaultDomain(SessionHelper.domain)
        .setCDDCParams(CDDCUtils.getCDDCParams())
        .setErrorCallback(this)
        .setWarningCallback(this)
        .build()!!

      orchestrator = instanceOrchestration
    }

    return instanceOrchestration
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
    val localOrchestrator = getOrchestrator()

    activationPromise = promise
    localOrchestrator.execute(command)
  }

  @ReactMethod
  fun removeCurrentUser(promise: Promise) {
    val localOrchestrator = getOrchestrator()

    try {
      val orchestratorUser = OrchestrationUser(storage.getCurrentUser())
      localOrchestrator.userManager.deleteUser(orchestratorUser)
      storage.removeNotificationIdForUser(storage.getCurrentUser() ?: "")
      storage.removeCurrentUser()
      promise.resolve("success")

    } catch (e: Exception) {
      Log.d(name, "removeCurrentUser exception ${e.message}")
      e.printStackTrace()
      promise.reject(e)
    }
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
    activationPromise.reject("serverError", "${error?.readableMessage}")
  }
}
