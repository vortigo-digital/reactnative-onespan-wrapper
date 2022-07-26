package com.reactnativeonespanbridgeandroid.utils

import android.content.Context
import android.util.Log
import com.google.android.gms.common.GooglePlayServicesNotAvailableException
import com.google.android.gms.common.GooglePlayServicesRepairableException
import com.google.android.gms.security.ProviderInstaller
import org.json.JSONException
import org.json.JSONObject
import java.io.BufferedReader
import java.io.DataOutputStream
import java.io.IOException
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.nio.charset.StandardCharsets
import java.security.NoSuchAlgorithmException
import javax.net.ssl.SSLContext

class HTTPUtils {

    private val TAG = HTTPUtils::class.java.name

    /**
     * Enable usage of TLSv1.2 regardless of the Android API Level See
     * https://developer.android.com/reference/javax/net/ssl/SSLSocket.html
     */
    fun enableTLSv12(applicationContext: Context?) {
        try {
            SSLContext.getInstance("TLSv1.2")
            applicationContext?.let { ProviderInstaller.installIfNeeded(it) }

        } catch (e: NoSuchAlgorithmException) {
            e.printStackTrace()
        } catch (e: GooglePlayServicesNotAvailableException) {
            e.printStackTrace()
        } catch (e: GooglePlayServicesRepairableException) {
            e.printStackTrace()
        }
    }

    /** Performs a POST network request  */
    @Throws(IOException::class)
    private fun performRawPostNetworkRequestJson(
        serverUrl: String, content: String, debug: Boolean
    ): String {
        return performRawPostNetworkRequestPrivate(serverUrl, content, debug)
    }

    /** Performs a POST network request  */
    @Throws(IOException::class)
    private fun performRawPostNetworkRequestPrivate(
        serverUrl: String, content: String, debug: Boolean
    ): String {
        if (debug) {
            Log.d(TAG, "performRawPostNetworkRequest, request: $serverUrl")
            Log.d(TAG, "performRawPostNetworkRequest, request params: $content")
        }

        // Open connection
        val url = URL(serverUrl)
        val urlConnection = url.openConnection() as HttpURLConnection
        urlConnection.readTimeout = 30000
        urlConnection.connectTimeout = 15000
        urlConnection.doInput = true
        urlConnection.doOutput = true
        urlConnection.useCaches = false
        urlConnection.requestMethod = "POST"
        urlConnection.setRequestProperty("Content-Type", "application/json")
        urlConnection.setRequestProperty("charset", "utf-8")
        urlConnection.setRequestProperty(
            "Content-Length",
            Integer.toString(content.toByteArray(StandardCharsets.UTF_8).size)
        )

        val wr = DataOutputStream(urlConnection.outputStream)
        wr.write(content.toByteArray(StandardCharsets.UTF_8))
        wr.flush()
        wr.close()

        val response = getConnectionRawResponse(urlConnection)

        if (debug) Log.d(TAG, "performRawPostNetworkRequest, response: $response")

        return response
    }

    @Throws(IOException::class)
    private fun getConnectionRawResponse(connection: HttpURLConnection): String {
        val total = StringBuilder()

        BufferedReader(
            InputStreamReader(connection.inputStream, StandardCharsets.UTF_8)
        ).use { r ->
            var line: String?
            while (r.readLine().also { line = it } != null) {
                total.append(line)
            }
        }

        return total.toString()
    }

    /** Performs a simple GET network request with json as input data  */
    @Throws(Exception::class)
    fun performJSONRequest(
        serverUrl: String, content: Map<String?, String?>?, debug: Boolean
    ): Map<String?, String?>? {
        // Perform network request with JSON key/values content
        val jsonKeyValue = JSONObject(content)
        val respString = performRawPostNetworkRequestJson(serverUrl, jsonKeyValue.toString(), debug)

        // Parse the HTTP result
        return parseJsonKeyValueSerializedData(respString)
    }

    /**
     * Parses a serialized data (e.g. JSON key/values)
     *
     * @param data Data to parse
     * @return Map containing the parsed data
     */
    @Throws(JSONException::class)
    fun parseJsonKeyValueSerializedData(data: String): Map<String?, String?>? {
        val response: MutableMap<String?, String?> = HashMap()
        val json = JSONObject(data.trim { it <= ' ' })
        val keys: Iterator<*> = json.keys()

        while (keys.hasNext()) {
            val key = keys.next() as String
            val value = json.getString(key)
            response[key] = value
        }

        return response
    }
}
