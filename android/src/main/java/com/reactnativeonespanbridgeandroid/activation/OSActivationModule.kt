package com.reactnativeonespanbridgeandroid.activation

import android.util.Log
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.reactnativeonespanbridgeandroid.settings.SessionHelper
import com.reactnativeonespanbridgeandroid.utils.CDDCUtils
import com.reactnativeonespanbridgeandroid.utils.CommandSender
import com.reactnativeonespanbridgeandroid.utils.HTTPUtils
import com.reactnativeonespanbridgeandroid.utils.SharedPreferencesStorage
import com.vasco.orchestration.client.Orchestrator
import com.vasco.orchestration.client.authentication.UserAuthenticationCallback
import com.vasco.orchestration.client.authentication.UserAuthenticationInputCallback
import com.vasco.orchestration.client.errors.*
import com.vasco.orchestration.client.flows.activation.online.OnlineActivationCallback
import com.vasco.orchestration.client.flows.activation.online.OnlineActivationInputError
import com.vasco.orchestration.client.flows.activation.online.OnlineActivationParams
import com.vasco.orchestration.client.user.OrchestrationUser
import java.lang.ref.WeakReference
import java.util.concurrent.ExecutionException
import java.util.concurrent.Executors
import java.util.concurrent.Future

class OSActivationModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext),
  OnlineActivationCallback,
  UserAuthenticationCallback,
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

      HTTPUtils().enableTLSv12(currentActivity.applicationContext)

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
    Log.d("FLMWG", "execute command: $command")
    activationPromise = promise
    orchestrator.execute(command)
//    sendCommand(command)
  }

  // orchestration callbacks
  override fun onUserAuthenticationRequired(
    type: UserAuthenticationCallback.UserAuthentication?,
    inputCallback: UserAuthenticationInputCallback?,
    isEnrollment: Boolean
  ) {
    Log.d(name, "user type name: " + type?.name)
    Log.d(name, "user isEnrollment: $isEnrollment")

    inputCallback?.onUserAuthenticationInputSuccess("xxx")
  }

  override fun onUserAuthenticationInputError(error: InputError?) {
    Log.e(name, "input error: ", error?.inputException)
    activationPromise.reject("errorCode", "${error?.errorCode}")
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
    Log.e(name, "onOrchestrationServerError, customPayload:${error?.customPayload}")
//    activationPromise.reject("serverError", "${error?.customPayload}")
  }


  // remover quando react estiver pronto
  private fun sendCommand(command: String?) {
    val executor = Executors.newSingleThreadExecutor()

    val commandSender = CommandSender(command ?: "")

    val future: Future<String> = executor.submit(commandSender)

    executor.submit {
      try {
        val serverCommand = future.get()

        if (serverCommand == null) {
          Log.e("FLMWG", "sendCommandToServer: serverCommand == null")

        } else {
          orchestrator.execute(serverCommand)
        }

      } catch (e: ExecutionException) {
        Thread.currentThread().interrupt()
        Log.e("FLMWG", "sendCommandToServer ExecutionException: $e")
      }
    }
  }
}
