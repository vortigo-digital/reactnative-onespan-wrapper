package com.reactnativeonespanbridgeandroid.utils

import android.content.Context

class SharedPreferencesStorage(context: Context) {

  private val sharedPreferences = context.getSharedPreferences(PREF_KEY, Context.MODE_PRIVATE)

  fun setCurrentUser(currentUser: String) {
    sharedPreferencesPutString(PREF_USERID, currentUser)
  }

  fun getCurrentUser() = sharedPreferencesGetString(PREF_USERID)

  fun removeCurrentUser() {
    sharedPreferencesRemove(PREF_USERID)
  }

  fun storageNotificationIdForUser(userIdentifier: String, notificationId: String) {
    sharedPreferencesPutString("$PREF_NOTIFICATION_ID-$userIdentifier", notificationId)
  }

  fun getStorageNotificationIdForUser(userIdentifier: String) =
    sharedPreferencesGetString("$PREF_NOTIFICATION_ID-$userIdentifier")

  fun removeNotificationIdForUser(userIdentifier: String) {
    sharedPreferencesRemove("$PREF_NOTIFICATION_ID-$userIdentifier")
  }

  fun storageMainActivityPath(path: String) {
    sharedPreferencesPutString(ACTIVITY_PATH, path)
  }

  fun getStorageMainActivityPath() = sharedPreferencesGetString(ACTIVITY_PATH)

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
    const val ACTIVITY_PATH = "mainActivityPath"
  }
}
