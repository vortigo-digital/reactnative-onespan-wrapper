package com.reactnativeonespanbridgeandroid.settings

import java.util.*

object SessionHelper {
  var accountIdentifier = ""
  var cloudServerUrl = ""
  var saltStorage = ""
  var saltDigipass = ""
  val domain: String get() = accountIdentifier.lowercase(Locale.getDefault())
  val endpointUrl: String get() = "https://$accountIdentifier$cloudServerUrl/v1/orchestration-commands"
  const val serverCommandKey = "command"  // REMOVER
}
