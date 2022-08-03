package com.reactnativeonespanbridgeandroid.settings

import java.util.*

object SessionHelper {
  var domainIdentifier = ""
  var saltStorage = ""
  var saltDigipass = ""
  val domain: String get() = domainIdentifier.lowercase(Locale.getDefault())
}
