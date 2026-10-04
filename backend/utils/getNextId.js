// Helper function to auto-increment numeric IDs
async function getNextId(Model, idFieldName) {
    const lastDoc = await Model.findOne().sort({ [idFieldName]: -1 });
    return lastDoc && lastDoc[idFieldName] ? lastDoc[idFieldName] + 1 : 1;
}

module.exports = getNextId;
