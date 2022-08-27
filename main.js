// Use strict
"use strict";


// Classes

// X25519 class
class X25519 {

	// Public
	
		// Initialize
		static initialize() {
		
			// Set instance to invalid
			X25519.instance = X25519.INVALID;
		
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Set settings
				var settings = {
				
					// On abort
					"onAbort": function(error) {
					
						// Prevent on abort from being called again
						delete settings["onAbort"];
						
						// Reject error
						reject("Failed to download resource");
					}
				};
				
				// Create X25519 instance
				x25519(settings).then(function(instance) {
				
					// Prevent on abort from being called
					delete settings["onAbort"];
				
					// Set instance
					X25519.instance = instance;
					
					// Resolve
					resolve();
				});
			});
		}
		
		// Secret key from Ed25519 secret key
		static secretKeyFromEd25519SecretKey(ed25519SecretKey) {
		
			// Check if instance doesn't exist
			if(typeof X25519.instance === "undefined")
			
				// Set instance
				X25519.instance = x25519();
		
			// Check if instance is invalid
			if(X25519.instance === X25519.INVALID)
			
				// Return operation failed
				return X25519.OPERATION_FAILED;
			
			// Initialize secret key to size of secret key
			var secretKey = new Uint8Array(X25519.instance._secretKeySize());
			
			// Allocate and fill memory
			var secretKeyBuffer = X25519.instance._malloc(secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]);
			
			var ed25519SecretKeyBuffer = X25519.instance._malloc(ed25519SecretKey["length"] * ed25519SecretKey["BYTES_PER_ELEMENT"]);
			X25519.instance["HEAPU8"].set(ed25519SecretKey, ed25519SecretKeyBuffer / ed25519SecretKey["BYTES_PER_ELEMENT"]);
			
			// Check if getting secret key from Ed25519 secret key failed
			if(X25519.instance._secretKeyFromEd25519SecretKey(secretKeyBuffer, ed25519SecretKeyBuffer, ed25519SecretKey["length"] * ed25519SecretKey["BYTES_PER_ELEMENT"]) === X25519.C_FALSE) {
			
				// Clear memory
				X25519.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
				X25519.instance["HEAPU8"].fill(0, ed25519SecretKeyBuffer / ed25519SecretKey["BYTES_PER_ELEMENT"], ed25519SecretKeyBuffer / ed25519SecretKey["BYTES_PER_ELEMENT"] + ed25519SecretKey["length"]);
				
				// Free memory
				X25519.instance._free(secretKeyBuffer);
				X25519.instance._free(ed25519SecretKeyBuffer);
			
				// Return operation failed
				return X25519.OPERATION_FAILED;
			}
			
			// Get secret key
			secretKey = new Uint8Array(X25519.instance["HEAPU8"].subarray(secretKeyBuffer, secretKeyBuffer + secretKey["length"]));
			
			// Clear memory
			X25519.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
			X25519.instance["HEAPU8"].fill(0, ed25519SecretKeyBuffer / ed25519SecretKey["BYTES_PER_ELEMENT"], ed25519SecretKeyBuffer / ed25519SecretKey["BYTES_PER_ELEMENT"] + ed25519SecretKey["length"]);
			
			// Free memory
			X25519.instance._free(secretKeyBuffer);
			X25519.instance._free(ed25519SecretKeyBuffer);
			
			// Return secret key
			return secretKey;
		}
		
		// Public key from Ed25519 public key
		static publicKeyFromEd25519PublicKey(ed25519PublicKey) {
		
			// Check if instance doesn't exist
			if(typeof X25519.instance === "undefined")
			
				// Set instance
				X25519.instance = x25519();
		
			// Check if instance is invalid
			if(X25519.instance === X25519.INVALID)
			
				// Return operation failed
				return X25519.OPERATION_FAILED;
			
			// Initialize public key to size of public key
			var publicKey = new Uint8Array(X25519.instance._publicKeySize());
			
			// Allocate and fill memory
			var publicKeyBuffer = X25519.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			
			var ed25519PublicKeyBuffer = X25519.instance._malloc(ed25519PublicKey["length"] * ed25519PublicKey["BYTES_PER_ELEMENT"]);
			X25519.instance["HEAPU8"].set(ed25519PublicKey, ed25519PublicKeyBuffer / ed25519PublicKey["BYTES_PER_ELEMENT"]);
			
			// Check if getting public key from Ed25519 public key failed
			if(X25519.instance._publicKeyFromEd25519PublicKey(publicKeyBuffer, ed25519PublicKeyBuffer, ed25519PublicKey["length"] * ed25519PublicKey["BYTES_PER_ELEMENT"]) === X25519.C_FALSE) {
			
				// Clear memory
				X25519.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
				X25519.instance["HEAPU8"].fill(0, ed25519PublicKeyBuffer / ed25519PublicKey["BYTES_PER_ELEMENT"], ed25519PublicKeyBuffer / ed25519PublicKey["BYTES_PER_ELEMENT"] + ed25519PublicKey["length"]);
				
				// Free memory
				X25519.instance._free(publicKeyBuffer);
				X25519.instance._free(ed25519PublicKeyBuffer);
			
				// Return operation failed
				return X25519.OPERATION_FAILED;
			}
			
			// Get public key
			publicKey = new Uint8Array(X25519.instance["HEAPU8"].subarray(publicKeyBuffer, publicKeyBuffer + publicKey["length"]));
			
			// Clear memory
			X25519.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			X25519.instance["HEAPU8"].fill(0, ed25519PublicKeyBuffer / ed25519PublicKey["BYTES_PER_ELEMENT"], ed25519PublicKeyBuffer / ed25519PublicKey["BYTES_PER_ELEMENT"] + ed25519PublicKey["length"]);
			
			// Free memory
			X25519.instance._free(publicKeyBuffer);
			X25519.instance._free(ed25519PublicKeyBuffer);
			
			// Return public key
			return publicKey;
		}
		
		// Shared secret key from secret key and public key
		static sharedSecretKeyFromSecretKeyAndPublicKey(secretKey, publicKey) {
		
			// Check if instance doesn't exist
			if(typeof X25519.instance === "undefined")
			
				// Set instance
				X25519.instance = x25519();
		
			// Check if instance is invalid
			if(X25519.instance === X25519.INVALID)
			
				// Return operation failed
				return X25519.OPERATION_FAILED;
			
			// Initialize shared secret key to size of shared secret key
			var sharedSecretKey = new Uint8Array(X25519.instance._sharedSecretKeySize());
			
			// Allocate and fill memory
			var sharedSecretKeyBuffer = X25519.instance._malloc(sharedSecretKey["length"] * sharedSecretKey["BYTES_PER_ELEMENT"]);
			
			var secretKeyBuffer = X25519.instance._malloc(secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]);
			X25519.instance["HEAPU8"].set(secretKey, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"]);
			
			var publicKeyBuffer = X25519.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			X25519.instance["HEAPU8"].set(publicKey, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"]);
			
			// Check if getting shared secret key from secret key and public key failed
			if(X25519.instance._sharedSecretKeyFromSecretKeyAndPublicKey(sharedSecretKeyBuffer, secretKeyBuffer, secretKey["length"] * secretKey["BYTES_PER_ELEMENT"], publicKeyBuffer, publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]) === X25519.C_FALSE) {
			
				// Clear memory
				X25519.instance["HEAPU8"].fill(0, sharedSecretKeyBuffer / sharedSecretKey["BYTES_PER_ELEMENT"], sharedSecretKeyBuffer / sharedSecretKey["BYTES_PER_ELEMENT"] + sharedSecretKey["length"]);
				X25519.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
				X25519.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			
				// Free memory
				X25519.instance._free(sharedSecretKeyBuffer);
				X25519.instance._free(secretKeyBuffer);
				X25519.instance._free(publicKeyBuffer);
			
				// Return operation failed
				return X25519.OPERATION_FAILED;
			}
			
			// Get shared secret key
			sharedSecretKey = new Uint8Array(X25519.instance["HEAPU8"].subarray(sharedSecretKeyBuffer, sharedSecretKeyBuffer + sharedSecretKey["length"]));
			
			// Clear memory
			X25519.instance["HEAPU8"].fill(0, sharedSecretKeyBuffer / sharedSecretKey["BYTES_PER_ELEMENT"], sharedSecretKeyBuffer / sharedSecretKey["BYTES_PER_ELEMENT"] + sharedSecretKey["length"]);
			X25519.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
			X25519.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			
			// Free memory
			X25519.instance._free(sharedSecretKeyBuffer);
			X25519.instance._free(secretKeyBuffer);
			X25519.instance._free(publicKeyBuffer);
			
			// Return shared secret key
			return sharedSecretKey;
		}
		
		// Operation failed
		static get OPERATION_FAILED() {
		
			// Return operation failed
			return null;
		}
	
	// Private
	
		// Invalid
		static get INVALID() {
		
			// Return invalid
			return null;
		}
		
		// C false
		static get C_FALSE() {
		
			// Return C false
			return 0;
		}
}


// Supporting fuction implementation

// Check if document doesn't exist
if(typeof document === "undefined") {

	// Create document
	var document = {};
}

// Check if module exports exists
if(typeof module === "object" && module !== null && "exports" in module === true) {

	// Exports
	module["exports"] = X25519;
}
