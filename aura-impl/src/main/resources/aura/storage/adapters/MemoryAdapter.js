/*
 * Copyright (C) 2012 salesforce.com, inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint sub: true */
/**
 * @namespace The Memory adapter for storage service implementation
 * @constructor
 */
var MemoryStorageAdapter = function MemoryStorageAdapter() {
	this.clear();
};

MemoryStorageAdapter.prototype.getName = function() {
	return "memory";
};

MemoryStorageAdapter.prototype.getSize = function() {
	return this.size;
};

MemoryStorageAdapter.prototype.getItem = function(key, resultCallback) {
	resultCallback(this.cache[key]);
};

MemoryStorageAdapter.prototype.setItem = function(key, item) {
	item.size = key.length + this.calculateSize(item["value"]);

	this.size += item.size;
	this.cache[key] = item;
};

MemoryStorageAdapter.prototype.removeItem = function(key) {
	var item = this.cache[key];
	this.size -= item.size;
	
	delete this.cache[key];
};

MemoryStorageAdapter.prototype.clear = function(key) {
	this.cache = {};
    this.size = 0;
};

MemoryStorageAdapter.prototype.getExpired = function() {
	var now = new Date().getTime();
	var expired = [];
	
	for (var key in this.cache) {
		var expires = this.cache[key]["expires"];
		if (now > expires) {
			expired.push(key);
		}
	}
	
	return expired;
};

// Internals

MemoryStorageAdapter.prototype.calculateSize = function(value) {
	// DCHASMAN TODO create an object graph traversal size algorithm
	return value ? $A.util["json"].encode(value).length : 0;
};

