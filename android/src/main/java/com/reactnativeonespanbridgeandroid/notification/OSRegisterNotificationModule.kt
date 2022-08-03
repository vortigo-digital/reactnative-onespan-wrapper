package com.reactnativeonespanbridgeandroid.notification

import android.util.Log
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.reactnativeonespanbridgeandroid.settings.SessionHelper
import com.reactnativeonespanbridgeandroid.utils.CDDCUtils
import com.reactnativeonespanbridgeandroid.utils.SharedPreferencesStorage
import com.vasco.digipass.sdk.utils.notification.client.NotificationSDKClient
import com.vasco.digipass.sdk.utils.notification.client.exceptions.NotificationSDKClientException
import com.vasco.orchestration.client.Orchestrator
import com.vasco.orchestration.client.errors.*
import com.vasco.orchestration.client.flows.notification.NotificationRegistrationCallback
import com.vasco.orchestration.client.flows.notification.NotificationRegistrationParams
import com.vasco.orchestration.client.user.OrchestrationUser
import java.lang.ref.WeakReference

class OSRegisterNotificationModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext),
  NotificationRegistrationCallback,
  OrchestrationWarningCallback,
  OrchestrationErrorCallback {

  override fun getName() = "OSRegisterNotificationModule"

  private lateinit var orchestrator: Orchestrator
  private lateinit var notificationPromise: Promise
  private val storage = SharedPreferencesStorage(reactContext)

  @ReactMethod
  fun registerForNotifications(promise: Promise) {
    notificationPromise = promise

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

    val listener = object : NotificationSDKClient.NotificationSDKClientListener {

      override fun onRegistrationSuccess(notificationId: String?) {

        val orchestrationUsers = orchestrator.userManager.users

        Log.d("FLMWG", "OrchestrationUsers: ${orchestrationUsers.size}")

        for (orchestrationUser in orchestrationUsers) {

          Log.d("FLMWG", "OrchestrationUser: ${orchestrationUser.userIdentifier}")

          val storedNotificationId = storage.getStorageNotificationIdForUser(orchestrationUser.userIdentifier ?: "")

          if (storedNotificationId == null || storedNotificationId != notificationId) {
            val notificationRegistrationParams = NotificationRegistrationParams()

            notificationRegistrationParams.orchestrationUser = orchestrationUser
            notificationRegistrationParams.notificationIdentifier = notificationId
            notificationRegistrationParams.notificationRegistrationCallback =
              this@OSRegisterNotificationModule

            orchestrator.startNotificationRegistration(notificationRegistrationParams)

            Log.d("FLMWG", "Push notification registration for ${orchestrationUser.userIdentifier}"
            )
          }
        }
      }

      override fun onException(e: NotificationSDKClientException) {
        Log.e(name, "Exception when retrieving notification Id: errorCode ${e.errorCode}", e)
        notificationPromise.reject("errorCode", "Exception when retrieving notification Id: errorCode ${e.errorCode}")
      }
    }

    NotificationSDKClient.registerNotificationService(reactContext.currentActivity, listener)
  }

  override fun onNotificationRegistrationStepComplete(command: String?) {
    Log.d(name, "onNotificationRegistrationStepComplete / command: $command")
    notificationPromise.resolve(command)
  }

  override fun onNotificationRegistrationSuccess(
    orchestrationUser: OrchestrationUser?,
    notificationIdentifier: String?
  ) {
    Log.d(name, "onNotificationRegistrationSuccess")

    storage.storageNotificationIdForUser(
      orchestrationUser?.userIdentifier ?: "",
      notificationIdentifier ?: ""
    )

    notificationPromise.resolve("notificationId:$notificationIdentifier")
  }

  @ReactMethod
  fun execute(command: String, promise: Promise) {
    Log.d("FLMWG", "execute command: $command")
    notificationPromise = promise
    orchestrator.execute(command)
  }

  // orchestration callbacks
  override fun onOrchestrationWarning(warning: OrchestrationWarning?) {
    Log.w(name, "warning, code:${warning?.warningCode} / exception:${warning?.exception}")
  }

  override fun onOrchestrationError(error: OrchestrationError?) {
    Log.e(name, "onOrchestrationError, code:${error?.errorCode} / exception:${error?.exception}")
    notificationPromise.reject("errorCode", "${error?.errorCode}")
  }

  override fun onOrchestrationServerError(error: OrchestrationServerError?) {
    Log.e(name, "onOrchestrationServerError, customPayload:${error?.customPayload}")
  }
}
