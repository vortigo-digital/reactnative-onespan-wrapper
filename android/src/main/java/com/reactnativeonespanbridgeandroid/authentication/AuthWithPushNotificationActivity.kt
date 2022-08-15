package com.reactnativeonespanbridgeandroid.authentication

import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.reactnativeonespanbridgeandroid.utils.SharedPreferencesStorage
import com.vasco.digipass.sdk.utils.notification.client.NotificationSDKClient
import com.vasco.digipass.sdk.utils.notification.client.exceptions.NotificationSDKClientException

class AuthWithPushNotificationActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    checkIntentForNotification(intent)
  }

  override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)

    checkIntentForNotification(intent)
  }

  private fun checkIntentForNotification(intent: Intent?) {
    Log.d("AuthWithPushNotificationActivity", "AuthNotificationActivity checkIntentForNotification")
    val storage = SharedPreferencesStorage(this)

    try {
      setIntent(null);

      // make sure the intent contains a notification
      if (NotificationSDKClient.isVASCONotification(intent)) {

        // get the command from the notification
        val command = NotificationSDKClient.parseVASCONotification(intent)
        Log.d("AuthWithPushNotificationActivity", "checkIntentForNotification command: $command")

        OSAuthWithPushNotificationModule.notificationCommand = command

        val activityPath = storage.getStorageMainActivityPath() ?: ""

        val newIntent = Intent(this, Class.forName(activityPath))

        finish()
        reactInstanceManager.currentReactContext?.currentActivity?.finish()

        startActivity(newIntent)
      }

    } catch (e: NotificationSDKClientException) {
      Log.e("AuthWithPushNotificationActivity", "NotificationSDKClientException in checkIntentForNotification", e)
      e.printStackTrace()

    }catch (e: ClassNotFoundException) {
      Log.e("AuthWithPushNotificationActivity", "ClassNotFoundException in checkIntentForNotification", e)
      e.printStackTrace()
    }
  }

}
