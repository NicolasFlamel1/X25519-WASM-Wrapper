// Header files
#include <cstddef>
#include <cstring>
#include "./supercop-20220213/crypto_dh/curve25519/ref/api.h"

// Check if using Emscripten
#ifdef __EMSCRIPTEN__

	// Header files
	#include <emscripten.h>
	#include "./crypto_hash_sha512.h"
	#include "./crypto_scalarmult.h"
	#include "fe.h"

// Otherwise
#else

	// Header files
	extern "C" {
		#include "./crypto_hash_sha512.h"
		#include "./crypto_scalarmult.h"
		#include "fe.h"
	}
#endif

using namespace std;


// Definitions

// Check if using Emscripten
#ifdef __EMSCRIPTEN__

	// Export
	#define EXPORT extern "C"

// Otherwise
#else

	// Export
	#define EXPORT static

	// Emscripten keepalive
	#define EMSCRIPTEN_KEEPALIVE
#endif


// Function prototypes

// Secret key size
EXPORT size_t EMSCRIPTEN_KEEPALIVE secretKeySize();

// Secret key from Ed25519 secret key
EXPORT bool EMSCRIPTEN_KEEPALIVE secretKeyFromEd25519SecretKey(uint8_t *secretKey, const uint8_t *ed25519SecretKey, size_t ed25519SecretKeySize);

// Public key size
EXPORT size_t EMSCRIPTEN_KEEPALIVE publicKeySize();

// Public key from Ed25519 public key
EXPORT bool EMSCRIPTEN_KEEPALIVE publicKeyFromEd25519PublicKey(uint8_t *publicKey, const uint8_t *ed25519PublicKey, size_t ed25519PublicKeySize);

// Shared secret key size
EXPORT size_t EMSCRIPTEN_KEEPALIVE sharedSecretKeySize();

// Shared secret key from secret key and public key
EXPORT bool EMSCRIPTEN_KEEPALIVE sharedSecretKeyFromSecretKeyAndPublicKey(uint8_t *sharedSecretKey, const uint8_t *secretKey, size_t secretKeySize, const uint8_t *publicKey, size_t publicKeySize);


// Supporting function implementation

// Secret key size
size_t secretKeySize() {

	// Return secret key size
	return CRYPTO_SECRETKEYBYTES;
}

// Secret key from Ed25519 secret key
bool secretKeyFromEd25519SecretKey(uint8_t *secretKey, const uint8_t *ed25519SecretKey, size_t ed25519SecretKeySize) {

	// Check if Ed25519 secret key is invalid
	if(ed25519SecretKeySize != CRYPTO_SECRETKEYBYTES) {
	
		// Return false
		return false;
	}
	
	// Get hash of the Ed25519 secret key
	uint8_t hash[crypto_hash_sha512_BYTES];
	crypto_hash_sha512(hash, ed25519SecretKey, CRYPTO_SECRETKEYBYTES);
	
	// Copy hash to secret key
	memcpy(secretKey, hash, CRYPTO_SECRETKEYBYTES);
	
	// Clear memory
	explicit_bzero(hash, sizeof(hash));
	
	// Clamp the secret key
	secretKey[0] &= 0b11111000;
	secretKey[31] &= 0b01111111;
	secretKey[31] |= 0b01000000;
	
	// Return true
	return true;
}

// Public key size
size_t publicKeySize() {

	// Return public key size
	return CRYPTO_PUBLICKEYBYTES;
}

// Public key from Ed25519 public key
bool publicKeyFromEd25519PublicKey(uint8_t *publicKey, const uint8_t *ed25519PublicKey, size_t ed25519PublicKeySize) {

	// Check if Ed25519 public key is invalid
	if(ed25519PublicKeySize != CRYPTO_PUBLICKEYBYTES) {
	
		// Return false
		return false;
	}

	// Get Ed25519 public key's y value
	fe y;
	fe_frombytes(y, ed25519PublicKey);

	// Initialize one
	fe one;
	fe_1(one);
	
	// Compute 1 + y
	fe onePlusY;
	fe_add(onePlusY, one, y);
	
	// Compute 1 - y
	fe oneMinusY;
	fe_sub(oneMinusY, one, y);
	
	// Compute (1 + y) / (1 - y)
	fe_invert(oneMinusY, oneMinusY);
	fe_mul(onePlusY, onePlusY, oneMinusY);
	
	// Set the public key to the result
	fe_tobytes(publicKey, onePlusY);
	
	// Return true
	return true;
}

// Shared secret key size
size_t sharedSecretKeySize() {

	// Return shared secret key size
	return CRYPTO_SECRETKEYBYTES;
}

// Shared secret key from secret key and public key
bool sharedSecretKeyFromSecretKeyAndPublicKey(uint8_t *sharedSecretKey, const uint8_t *secretKey, size_t secretKeySize, const uint8_t *publicKey, size_t publicKeySize) {

	// Check if secret key or public key are invalid
	if(secretKeySize != CRYPTO_SECRETKEYBYTES || publicKeySize != CRYPTO_PUBLICKEYBYTES) {
	
		// Return false
		return false;
	}

	// Check if getting the shared secret key failed
	if(crypto_scalarmult(sharedSecretKey, secretKey, publicKey)) {
	
		// Return false
		return false;
	}
	
	// Return true
	return true;
}
