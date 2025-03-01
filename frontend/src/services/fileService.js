export default {
    async toBase64(file) {
        let result = null;

        try {
            let promise = new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    let encoded = reader.result.replace(/^.*,/, "");
                    if((encoded.length % 4) > 0) {
                        encoded += '='.repeat(4 - (encoded.length % 4));
                    }
                    resolve(encoded);
                } 
                reader.onerror = reject;
            });
            result = await promise;
        } catch (error) {
            console.log(error);
        }

        return result;
    }
}