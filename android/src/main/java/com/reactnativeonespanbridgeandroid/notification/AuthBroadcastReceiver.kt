package com.reactnativeonespanbridgeandroid.notification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class AuthBroadcastReceiver : BroadcastReceiver() {

  override fun onReceive(context: Context?, intent: Intent?) {
    Log.d("FLMWG", "AuthBroadcastReceiver")
  }

}
