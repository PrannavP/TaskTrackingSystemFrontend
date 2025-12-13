// hooks/useAuthFetch.js
import { useState } from 'react'


/**
 * Custom hook for making authenticated API requests
 */
export function useLoginFetch() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    /**
     * Make an authenticated fetch request
     * @param {string} url - The API endpoint
     * @param {Object} options - Fetch options (method, body, etc)
     * @param {Toast} toast - Used to show toast msg
     * @returns {Promise<any>} - The response data
     */
    const loginFetch = async (url, options = {}, toast) => {
        debugger;
        setLoading(true)
        setError(null)

        if(!toast){
            alert("Toast not sent. Fix the code "+url);
            throw new Error("Toast not sent");
        }

        try {
            // Is the request has a form data or not
            const isFormData = options.body instanceof FormData

            // If reqeust if a FormData then send empty headers else send default
            const defaultHeaders = isFormData ? {} : { 'Content-Type': 'application/json' }

            // Merge provided options with defaults
            const fetchOptions = {
                // ...defaultOptions,
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...options.headers
                },
                credentials: 'include'
            }

            const response = await fetch('http://localhost:3005/api/v1' + url, fetchOptions)

            // Handle non-2xx responses
            if (!response.ok) {
                //throw new Error(`Request failed with status: ${response.status}`)
            }

            setLoading(false)

            var final_response = null

            if (!toast) {
                return response
            } else {
                var final_response = await response.json()

                if (final_response.success === true && final_response.message != '') {
                    toast.success(final_response.message, {
                        position: 'top-right',
                        autoClose: 2000
                    })
                } else{
                    toast.error(final_response.message), {
                        position: 'top-right',
                        autoClose: 2000
                    }}
            }

            return final_response
        } catch (err) {
            setLoading(false)
            throw err
        }
    }

    return { loginFetch, loading, error }
}