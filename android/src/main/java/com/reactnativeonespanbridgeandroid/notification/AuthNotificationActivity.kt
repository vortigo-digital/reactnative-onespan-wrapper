package com.reactnativeonespanbridgeandroid.notification

import android.content.Intent
import android.os.Bundle
import android.os.PersistableBundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.vasco.digipass.sdk.utils.notification.client.NotificationSDKClient
import com.vasco.digipass.sdk.utils.notification.client.exceptions.NotificationSDKClientException

class AuthNotificationActivity : AppCompatActivity() {

  override fun onCreate(savedInstanceState: Bundle?, persistentState: PersistableBundle?) {
    super.onCreate(savedInstanceState, persistentState)
    checkIntentForNotification(intent)
  }

  override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    checkIntentForNotification(intent)
  }

  private fun checkIntentForNotification(intent: Intent?) {
    try {
      setIntent(null);

      // Make sure the intent contains a notification
      if (NotificationSDKClient.isVASCONotification(intent)) {

        // Get the command from the notification
        val command = NotificationSDKClient.parseVASCONotification(intent);
        Log.d("FLMWG", "command: $command")

        // orchestrator.execute(command);
      }
    } catch (e: NotificationSDKClientException) {
      Log.e("FLMWG", "Exception in checkIntentForNotification", e);
    }
  }

}
