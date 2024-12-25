package com.karaokelink

import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import java.io.File
import java.io.IOException

class SoxBridge(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SoxBridge"
    }

    // Method to apply pitch shift to an audio file
    @ReactMethod
    fun applyPitchShift(filePath: String, pitch: Double, promise: Promise) {
        try {
            // Ensure the file exists
            val file = File(filePath)
            if (!file.exists()) {
                promise.reject("ERROR", "File not found at the specified path")
                return
            }

            // Apply pitch shift using Sox
            val outputFile = File(file.parent, "output_pitch_shifted.wav")

            // Command to execute Sox pitch shifting (change command arguments as needed)
            val command = arrayOf(
                "sox", file.absolutePath, outputFile.absolutePath, "pitch", pitch.toString()
            )

            val process = ProcessBuilder(*command).start()
            process.waitFor()

            if (process.exitValue() == 0) {
                // Return the output file path
                promise.resolve(outputFile.absolutePath)
            } else {
                promise.reject("ERROR", "Pitch shifting failed")
            }
        } catch (e: Exception) {
            promise.reject("ERROR", "Exception occurred while applying pitch shift: ${e.message}")
        }
    }
}
