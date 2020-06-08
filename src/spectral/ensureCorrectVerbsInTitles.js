/**
* Ensure that titles start with the right kind of verb,
* E.g. List, or Get for collections and individual files
*/

module.exports = (item, _, paths) => {
  const verb = item.operationId.split('_')[0]
  const endWithId = item.operationId.endsWith('_id')
  const endsWithS = item.operationId.endsWith('s')
  const endsWithStatus = item.operationId.endsWith('status')
  const firstWord = item.summary.split(' ')[0]

  // When getting an item by ID, use "Get"
  if (verb === 'get' && (endWithId || endsWithStatus) && firstWord !== 'Get') {
    return [
      {
        message: `${paths.target.join('.')} - summary should start with "Get"`,
      }
    ]
  } 
  // When getting all items, try to use "List" and reject "Get"
  else if (verb === 'get' && !(endWithId || endsWithStatus) && endsWithS && firstWord === 'Get') {
    return [
      {
        message: `${paths.target.join('.')} - summary should not start with "Get". Please use "List" where possible.`,
      }
    ]
  }
  // When deleting items, ensure we use "Delete" or "Remove" or "Permanently remove", or "Unassign"
  else if (verb === 'delete' && !(item.summary.startsWith('Delete') || item.summary.startsWith('Remove') || item.summary.startsWith('Permanently remove') || item.summary.startsWith('Unassign'))) {
    return [
      {
        message: `${paths.target.join('.')} - summary should start with "Delete" or "Remove" or "Permanently remove" or "Unassign".`,
      }
    ]
  }
  // When creating items, ensure we use "Create" or "Assign" or "Add"
  else if (verb === 'post' && endsWithS && !endWithId && !(item.summary.startsWith('Create') || item.summary.startsWith('Assign')  || item.summary.startsWith('Add'))) {
    return [
      {
        message: `${paths.target.join('.')} - summary should start with "Create" or "Assign" or "Add".`,
      }
    ]
  }
  // When updating items, ensure we use "Update" or "Transfer" por "Upload"
  else if (verb === 'put' && endWithId && !(item.summary.startsWith('Update') || item.summary.startsWith('Transfer') || item.summary.startsWith('Upload'))) {
    return [
      {
        message: `${paths.target.join('.')} - summary should start with "Update" or "Transfer" or "Upload".`,
      }
    ]
  }
}