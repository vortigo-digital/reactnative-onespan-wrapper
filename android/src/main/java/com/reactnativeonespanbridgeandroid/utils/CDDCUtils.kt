package com.reactnativeonespanbridgeandroid.utils

import com.vasco.orchestration.client.cddc.CDDCDataFeeder
import com.vasco.orchestration.client.cddc.CDDCParams
import java.util.HashSet

class CDDCUtils {

    companion object {
        fun getCDDCParams(): CDDCParams {
            val cddcParams = CDDCParams()
            val permissionFields = HashSet<CDDCParams.OptionalRetrievableFields>()

            permissionFields.add(CDDCParams.OptionalRetrievableFields.WiFi)
            permissionFields.add(CDDCParams.OptionalRetrievableFields.Bluetooth)
            permissionFields.add(CDDCParams.OptionalRetrievableFields.Geolocation)

            cddcParams.optionalRetrievableFields = permissionFields

            return cddcParams
        }

        fun configure(cddcDataFeeder: CDDCDataFeeder) {
            cddcDataFeeder.setApplicationReleaseDate(1501080258000L)
            cddcDataFeeder.setDeviceRooted(false)
            cddcDataFeeder.setRaspProtected(true)
        }
    }

}
