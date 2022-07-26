package com.reactnativeonespanbridgeandroid.utils

import android.content.Context

class SharedPreferencesStorage(context: Context) {

  private val sharedPreferences = context.getSharedPreferences(PREF_KEY, Context.MODE_PRIVATE)

  fun setCurrentUser(currentUser: String) {
    val editor = sharedPreferences.edit()
    editor.putString(PREF_USERID, currentUser)
    editor.apply()
  }

  fun getCurrentUser() = sharedPreferences.getString(PREF_USERID, null)

  fun storageNotificationIdForUser(userIdentifier: String, notificationId: String) {
    val editor = sharedPreferences.edit()
    editor.putString("$PREF_NOTIFICATION_ID-$userIdentifier", notificationId)
    editor.apply()
  }

  fun getStorageNotificationIdForUser(userIdentifier: String) =
    sharedPreferences.getString("$PREF_NOTIFICATION_ID-$userIdentifier", null)

  fun removeNotificationIdForUser(userIdentifier: String) {
    val editor = sharedPreferences.edit()
    editor.remove("$PREF_NOTIFICATION_ID-$userIdentifier")
    editor.apply()
  }

  companion object {
    const val PREF_KEY = "preferences"
    const val PREF_USERID = "userIdentifier"
    const val PREF_NOTIFICATION_ID = "notificationId"
  }
}
