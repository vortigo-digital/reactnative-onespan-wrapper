package com.reactnativeonespanbridgeandroid.authentication

import android.util.Log
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.*
import com.reactnativeonespanbridgeandroid.settings.SessionHelper
import com.reactnativeonespanbridgeandroid.utils.CDDCUtils
import com.vasco.orchestration.client.Orchestrator
import com.vasco.orchestration.client.authentication.UserAuthenticationCallback
import com.vasco.orchestration.client.authentication.UserAuthenticationCallback.UserAuthentication
import com.vasco.orchestration.client.authentication.UserAuthenticationInputCallback
import com.vasco.orchestration.client.errors.*
import com.vasco.orchestration.client.flows.PasswordError
import com.vasco.orchestration.client.flows.remote_authentication.RemoteAuthenticationCallback
import java.lang.ref.WeakReference

class OSAuthWithPushNotificationModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext),
  RemoteAuthenticationCallback,
  UserAuthenticationCallback,
  OrchestrationWarningCallback,
  OrchestrationErrorCallback {

  override fun getName() = "OSAuthWithPushNotificationModule"

  companion object {
    var notificationCommand :String? = null
  }

  private lateinit var authenticationPromise: Promise

  private lateinit var orchestrator: Orchestrator
  private lateinit var remoteAuthDisplayDataCaller: RemoteAuthenticationCallback.DisplayDataCaller

  @ReactMethod
  fun checkNotificationAndExecute(promise: Promise) {
    if (notificationCommand != null) {
      authenticationPromise = promise
      setOrchestratorAndExecute()

    } else {
      promise.resolve("")
    }
  }

  private fun setOrchestratorAndExecute() {
    Log.d("FLMWG", "setOrchestratorAndExecute")

    try {
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

      orchestrator.setRemoteAuthCallback(this)

      // used for custom password instead of default one
      orchestrator.setUserAuthenticationCallback(this, arrayOf(UserAuthentication.PASSWORD))

      val command = notificationCommand ?: ""
      notificationCommand = null
      Log.d("FLMWG", "setOrchestratorAndExecute command: $command")

      orchestrator.execute(command)

    }catch (e: Exception) {
      Log.e("setOrchestratorAndExecute", e.message ?: "")
      authenticationPromise.reject(e)
    }
  }

  override fun onRemoteAuthenticationStepComplete(command: String) {
    Log.d("FLMWG", "onRemoteAuthenticationStepComplete command: $command")
    authenticationPromise.resolve(command)
  }

  @ReactMethod
  fun execute(command: String, promise: Promise) {
    Log.d("FLMWG", "execute command: $command")
    authenticationPromise = promise
    orchestrator.execute(command)
  }

  override fun onRemoteAuthenticationDisplayData(
    dataToDisplay: String?,
    displayDataCaller: RemoteAuthenticationCallback.DisplayDataCaller?
  ) {
    displayDataCaller?.let { remoteAuthDisplayDataCaller = it }
    Log.d("FLMWG", "dataToDisplay: $dataToDisplay")

    /*if (dataToDisplay!!.contains("#")) {
      // parse data and display the host on which the user wants to connect
      val host = dataToDisplay.split("#").toTypedArray()[1]
      val user = dataToDisplay.split("#").toTypedArray()[0]

      Log.d("FLMWG", "dataToDisplay host: $host")
      Log.d("FLMWG", "dataToDisplay user: $user")

      // send data to front: approved / reject
    }*/

    authenticationPromise.resolve("data:$dataToDisplay")
  }

  @ReactMethod
  fun authenticationApproved(approved: Boolean, promise: Promise) {
    authenticationPromise = promise

    if (approved) {
      remoteAuthDisplayDataCaller.onDataApproved()
    } else {
      remoteAuthDisplayDataCaller.onDataRejected()
    }
  }

  override fun onRemoteAuthenticationSuccess(state: RemoteAuthenticationCallback.SuccessSessionState?) {
    val messageContent = when (state) {
      RemoteAuthenticationCallback.SuccessSessionState.Accepted -> "You have just signed in."
      RemoteAuthenticationCallback.SuccessSessionState.Refused -> "You have rejected the request."
      else -> "-"
    }
    Log.d("FLMWG", "state messageContent: $messageContent")
    authenticationPromise.resolve("success:$messageContent")
  }

  override fun onRemoteAuthenticationSessionOutdated(reason: RemoteAuthenticationCallback.SessionOutdatedReason?) {
    val sessionOutdated = when (reason) {
      RemoteAuthenticationCallback.SessionOutdatedReason.Expired -> "Session expired"
      RemoteAuthenticationCallback.SessionOutdatedReason.Accepted -> "Session accepted"
      RemoteAuthenticationCallback.SessionOutdatedReason.Refused -> "Session refused"
      RemoteAuthenticationCallback.SessionOutdatedReason.Unknown -> ""
      else -> ""
    }

    Log.d("FLMWG", "Session outdated: ${reason?.name}")
    Log.d("FLMWG", "Session outdated: $sessionOutdated")
  }

  override fun onRemoteAuthenticationAborted() {
    Log.e("FLMWG", "AuthNotificationActivity, onRemoteAuthenticationAborted")
  }

  override fun onRemoteAuthenticationPasswordError(passwordError: PasswordError?) {
    Log.e("FLMWG", "onRemoteAuthenticationPasswordError, ${passwordError?.errorCode}")
    authenticationPromise.reject("passwordError", "${passwordError?.errorCode}")
  }

  override fun onOrchestrationWarning(warning: OrchestrationWarning?) {
    Log.w("FLMWG", "warning, code:${warning?.warningCode} / exception:${warning?.exception}")
  }

  override fun onOrchestrationError(error: OrchestrationError?) {
    Log.e("FLMWG", "onOrchestrationError, code:${error?.errorCode} / exception:${error?.exception}")
    authenticationPromise.reject("errorCode", "${error?.errorCode}")
  }

  override fun onOrchestrationServerError(error: OrchestrationServerError?) {
    Log.e("FLMWG", "onOrchestrationServerError, customPayload:${error?.customPayload}")
  }

  override fun onUserAuthenticationRequired(
    p0: UserAuthentication?,
    p1: UserAuthenticationInputCallback?,
    p2: Boolean
  ) {
    Log.d("FLMWG", "onUserAuthenticationRequired")
  }

  override fun onUserAuthenticationInputError(p0: InputError?) {
    Log.d("FLMWG", "onUserAuthenticationInputError")
  }

}
