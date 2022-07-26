package com.reactnativeonespanbridgeandroid.utils

import android.util.Log
import com.reactnativeonespanbridgeandroid.settings.SessionHelper
import java.util.concurrent.Callable

class CommandSender(private val command: String) : Callable<String> {

    companion object {
        val TAG: String = CommandSender::class.java.name
    }

    override fun call(): String? {
        return try {
            // Make HTTP call
            val request: MutableMap<String, String> = HashMap()
            request[SessionHelper.serverCommandKey] = command

            val serverResponse: Map<String?, String?>? =
                HTTPUtils().performJSONRequest(SessionHelper.endpointUrl, request.toMap(), true)

            if (serverResponse == null) null
            else if (!serverResponse.containsKey(SessionHelper.serverCommandKey)) null
            else serverResponse[SessionHelper.serverCommandKey]

        } catch (e: Exception) {
            Log.e(TAG, "Exception in SendCommandTask", e)
            null
        }
    }

}
