// Abstracted built-in Node.js Modules

//@ts-ignore
export const crypto = (typeof require !== 'undefined' ? require('crypto') : {}) as typeof import('crypto');
export const assert = (typeof require !== 'undefined' ? require('assert') : {}) as typeof import('assert');
export const buffer = (typeof require !== 'undefined' ? require('buffer') : {}) as typeof import('buffer');
export const child_process = (typeof require !== 'undefined' ? require('child_process') : {}) as typeof import('child_process');
export const cluster = (typeof require !== 'undefined' ? require('cluster') : {}) as typeof import('cluster');
export const dgram = (typeof require !== 'undefined' ? require('dgram') : {}) as typeof import('dgram');
export const dns = (typeof require !== 'undefined' ? require('dns') : {}) as typeof import('dns');
export const domain = (typeof require !== 'undefined' ? require('domain') : {}) as typeof import('domain');
export const events = (typeof require !== 'undefined' ? require('events') : {}) as typeof import('events');
export const fs = (typeof require !== 'undefined' ? require('fs') : {}) as typeof import('fs');
export const http = (typeof require !== 'undefined' ? require('http') : {}) as typeof import('http');
export const https = (typeof require !== 'undefined' ? require('https') : {}) as typeof import('https');
export const net = (typeof require !== 'undefined' ? require('net') : {}) as typeof import('net');
export const os = (typeof require !== 'undefined' ? require('os') : {}) as typeof import('os');
export const path = (typeof require !== 'undefined' ? require('path') : {}) as typeof import('path');
export const punycode = (typeof require !== 'undefined' ? require('punycode') : {}) as typeof import('punycode');
export const querystring = (typeof require !== 'undefined' ? require('querystring') : {}) as typeof import('querystring');
export const readline = (typeof require !== 'undefined' ? require('readline') : {}) as typeof import('readline');
export const stream = (typeof require !== 'undefined' ? require('stream') : {}) as typeof import('stream');
export const string_decoder = (typeof require !== 'undefined' ? require('string_decoder') : {}) as typeof import('string_decoder');
export const timers = (typeof require !== 'undefined' ? require('timers') : {}) as typeof import('timers');
export const tls = (typeof require !== 'undefined' ? require('tls') : {}) as typeof import('tls');
export const tty = (typeof require !== 'undefined' ? require('tty') : {}) as typeof import('tty');
export const url = (typeof require !== 'undefined' ? require('url') : {}) as typeof import('url');
export const util = (typeof require !== 'undefined' ? require('util') : {}) as typeof import('util');
export const v8 = (typeof require !== 'undefined' ? require('v8') : {}) as typeof import('v8');
export const vm = (typeof require !== 'undefined' ? require('vm') : {}) as typeof import('vm');
export const zlib = (typeof require !== 'undefined' ? require('zlib') : {}) as typeof import('zlib');
