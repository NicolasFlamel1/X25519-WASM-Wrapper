# Library parameters
NAME = "X25519"
VERSION = "0.0.10"
CC = "em++"
CFLAGS = -Wall -D NDEBUG -Oz -finput-charset=UTF-8 -fexec-charset=UTF-8 -funsigned-char -ffunction-sections -fdata-sections -D VERSION=$(VERSION) -I "./" -I "./supercop-20220213/crypto_scalarmult/curve25519/ref10/" -s MODULARIZE=1 --memory-init-file=0 -s ABORTING_MALLOC=0 -s ALLOW_MEMORY_GROWTH=1 --closure 1 -flto -fno-rtti -fno-exceptions -s NO_FILESYSTEM=1 -s DISABLE_EXCEPTION_CATCHING=1 -s EXPORTED_FUNCTIONS="['_malloc', '_free']" -s EXPORT_NAME="x25519" -D CRYPTO_NAMESPACE\(x\)=x
LIBS =
SRCS = "./crypto_hash_sha512.c" "./main.cpp" "./supercop-20220213/crypto_scalarmult/curve25519/ref10/base.c" "./supercop-20220213/crypto_scalarmult/curve25519/ref10/fe_0.c" "./supercop-20220213/crypto_scalarmult/curve25519/ref10/fe_1.c" "./supercop-20220213/crypto_scalarmult/curve25519/ref10/fe_add.c" "./supercop-20220213/crypto_scalarmult/curve25519/ref10/fe_copy.c" "./supercop-20220213/crypto_scalarmult/curve25519/ref10/fe_cswap.c" "./supercop-20220213/crypto_scalarmult/curve25519/ref10/fe_frombytes.c" "./supercop-20220213/crypto_scalarmult/curve25519/ref10/fe_invert.c" "./supercop-20220213/crypto_scalarmult/curve25519/ref10/fe_mul.c" "./supercop-20220213/crypto_scalarmult/curve25519/ref10/fe_mul121666.c" "./supercop-20220213/crypto_scalarmult/curve25519/ref10/fe_sq.c" "./supercop-20220213/crypto_scalarmult/curve25519/ref10/fe_sub.c" "./supercop-20220213/crypto_scalarmult/curve25519/ref10/fe_tobytes.c" "./supercop-20220213/crypto_scalarmult/curve25519/ref10/scalarmult.c"

PROGRAM_NAME = $(subst $\",,$(NAME))

# Make WASM
wasm:
	$(CC) $(CFLAGS) -s WASM=1 -s ENVIRONMENT=web -o "./$(PROGRAM_NAME).js" $(SRCS) $(LIBS)
	cat "./main.js" >> "./$(PROGRAM_NAME).js"
	rm -rf "./dist"
	mkdir "./dist"
	mv "./$(PROGRAM_NAME).js" "./$(PROGRAM_NAME).wasm" "./dist/"

# Make asm.js
asmjs:
	$(CC) $(CFLAGS) -s WASM=0 -s ENVIRONMENT=web -o "./$(PROGRAM_NAME).js" $(SRCS) $(LIBS)
	cat "./main.js" >> "./$(PROGRAM_NAME).js"
	rm -rf "./dist"
	mkdir "./dist"
	mv "./$(PROGRAM_NAME).js" "./dist/"

# Make npm
npm:
	$(CC) $(CFLAGS) -s WASM=1 -s BINARYEN_ASYNC_COMPILATION=0 -s SINGLE_FILE=1 -o "./wasm.js" $(SRCS) $(LIBS)
	$(CC) $(CFLAGS) -s WASM=0 -s BINARYEN_ASYNC_COMPILATION=0 -s SINGLE_FILE=1 -o "./asm.js" $(SRCS) $(LIBS)
	echo "try { module[\"exports\"] = require(\"@nicolasflamel/x25519-native\");} catch(error) { const x25519 = (typeof WebAssembly !== \"undefined\") ? require(\"./wasm.js\") : require(\"./asm.js\");" > "./index.js"
	cat "./main.js" >> "./index.js"
	echo "}" >> "./index.js"
	rm -rf "./dist"
	mkdir "./dist"
	mv "./index.js" "./wasm.js" "./asm.js" "./dist/"

# Make clean
clean:
	rm -rf "./$(PROGRAM_NAME).js" "./$(PROGRAM_NAME).wasm" "./index.js" "./wasm.js" "./asm.js" "./dist" "./supercop-20220213" "./supercop-20220213.tar.xz"

# Make dependencies
dependencies:
	wget "https://bench.cr.yp.to/supercop/supercop-20220213.tar.xz"
	unxz < "./supercop-20220213.tar.xz" | tar -xf -
	rm "./supercop-20220213.tar.xz"
