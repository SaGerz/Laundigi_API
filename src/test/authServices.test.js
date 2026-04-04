const { registerService } = require("../services/authServices")

test('should throw error if required fields missing', async () => { 
    await expect(registerService({}, {}))
        .rejects
        .toThrow("Required fields missing");
 });