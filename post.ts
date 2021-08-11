/**
 * Parameters: Long URL, and (possibly) URL desired
 * 
 * Custom:
 * Does the custom already exist in the db?
 * 400 - Already exists
 * 201 - Doesn't already exist, added
 * ?? Does the long exist in the db?
 * >> Yes: Add to its customURL array
 * >> No: Create a new entry, with this as the custom URL array first entry
 * 
 * Random:
 * Does the long URL already exist in the db?
 * 409 - Old random
 * Add to its mini URL value
 * 201 - New random
 * Create a new entry, with this as its mini URL value
 */