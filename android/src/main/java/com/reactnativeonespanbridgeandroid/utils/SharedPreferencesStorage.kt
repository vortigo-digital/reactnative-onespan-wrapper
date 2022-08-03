package com.reactnativeonespanbridgeandroid.utils

import android.content.Context

class SharedPreferencesStorage(context: Context) {

  private val sharedPreferences = context.getSharedPreferences(PREF_KEY, Context.MODE_PRIVATE)

  fun setCurrentUser(currentUser: String) {
    sharedPreferencesPutString(PREF_USERID, currentUser)
  }

  fun getCurrentUser() = sharedPreferencesGetString(PREF_USERID)

  fun storageNotificationIdForUser(userIdentifier: String, notificationId: String) {
    sharedPreferencesPutString("$PREF_NOTIFICATION_ID-$userIdentifier", notificationId)
  }

  fun getStorageNotificationIdForUser(userIdentifier: String) =
    sharedPreferencesGetString("$PREF_NOTIFICATION_ID-$userIdentifier")

  fun removeNotificationIdForUser(userIdentifier: String) {
    sharedPreferencesRemove("$PREF_NOTIFICATION_ID-$userIdentifier")
  }

  private fun sharedPreferencesPutString(key: String, value: String) {
    val editor = sharedPreferences.edit()
    editor.putString(key, value)
    editor.apply()
  }

  private fun sharedPreferencesGetString(key: String): String? {
    return sharedPreferences.getString(key, null)
  }

  private fun sharedPreferencesRemove(key: String) {
    val editor = sharedPreferences.edit()
    editor.remove(key)
    editor.apply()
  }

  companion object {
    const val PREF_KEY = "preferences"
    const val PREF_USERID = "userIdentifier"
    const val PREF_NOTIFICATION_ID = "notificationId"
    const val ACCOUNT_ID = "accountIdentifier"
    const val SALT_STORAGE = "saltStorage"
    const val SALT_DIGIPASS = "saltDigipass"
  }
}
