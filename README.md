Text Encoding
=============

[GitHub] | [NPM] | [API Doc]

This project is a heavily refactored clone of an old abandoned [text-encoding](https://github.com/inexorabletash/text-encoding/) library with the following changes:

* Refactored into a modern TypeScript project.
* Separated the monolithic script into many logical modules.
* Each encoding is a separate module and can be loaded individually if needed.
* No longer a polyfill for the [Encoding API](https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API) but a API compatible replacement with advanced features like encoding support for not just UTF-8.

Usage
-----

Install the library as a dependency in your project:

```
npm install @kayahr/text-encoding
```

And then use it like this:

```typescript
import { TextEncoder, TextDecoder } from "@kayahr/text-encoding";

const encoder = new TextEncoder("big5");
const encoded = encoder.encode(string);

const decoder = new TextDecoder("big5");
const decoded = decoder.decode(encoded);
```

When importing the module from `@kayahr/text-encoding` then all provided encodings are loaded automatically. If you want to keep your application as small as possible then you can import the module like this instead:

```typescript
import { TextEncoder } from "@kayahr/text-encoding/no-encodings";
```

When doing this then no encodings are loaded and only UTF-8 is supported. When you later need a specific encoding then use imports like this:

```typescript
import "@kayahr/text-encoding/encodings/shift_jis";
```

Or import all encodings:

```typescript
import "@kayahr/text-encoding/encodings";
```

There is also a helper function for creating a text encoder which returns an implementation of the original TextEncoder (if present), when encoding is UTF-8 and an implementation of the custom TextEncoder from this library when encoding is not UTF-8:

```typescript
import { createTextEncoder } from "@kayahr/text-encoding";

const encoder = createTextEncoder(encoding);
```

Supported encodings
-------------------

| Encoding       | Aliases
|----------------|-----------------------------------------------------------------------------------------------------
| big5           | big5-hkscs, cn-big5, csbig5, x-x-big5
| euc-jp         | cseucpkdfmtjapanese, x-euc-jp
| euc-kr         | cseuckr, csksc56011987, iso-ir-149, korean, ks_c_5601-1987, ks_c_5601-1989, ksc5601, ksc_5601, windows-949
| gb18030        |
| gbk            | chinese, csgb2312, csiso58gb231280, gb2312, gb_2312, gb_2312-80, iso-ir-58, x-gbk
| ibm866         | 866, cp866, csibm866
| iso-2022-jp    | csiso2022jp
| shift_jis      | csshiftjis, ms932, ms_kanji, shift-jis, sjis, windows-31j, x-sjis
| utf-8          | unicode-1-1-utf-8, utf8
| utf-16le       | utf-16
| utf-16be       |
| iso-8859-2     | csisolatin2, iso-ir-101, iso8859-2, iso88592, iso_8859-2, iso_8859-2:1987, l2, latin2
| iso-8859-3     | csisolatin3, iso-ir-109, iso8859-3, iso88593, iso_8859-3, iso_8859-3:1988, l3, latin3
| iso-8859-4     | csisolatin4, iso-ir-110, iso8859-4, iso88594, iso_8859-4, iso_8859-4:1988, l4, latin4
| iso-8859-5     | csisolatincyrillic, cyrillic, iso-ir-144, iso8859-5, iso88595, iso_8859-5, iso_8859-5:1988
| iso-8859-6     | arabic, asmo-708, csiso88596e, csiso88596i, csisolatinarabic, ecma-114, iso-8859-6-e, iso-8859-6-i, iso-ir-127, iso8859-6, iso88596, iso_8859-6, iso_8859-6:1987
| iso-8859-7     | csisolatingreek, ecma-118, elot_928, greek, greek8, iso-ir-126, iso8859-7, iso88597, iso_8859-7, iso_8859-7:1987, sun_eu_greek
| iso-8859-8     | csiso88598e, csisolatinhebrew, hebrew, iso-8859-8-e, iso-ir-138, iso8859-8, iso88598, iso_8859-8, iso_8859-8:1988, visual
| iso-8859-10    | csisolatin6, iso-ir-157, iso8859-10, iso885910, l6, latin6
| iso-8859-13    | iso8859-13, iso885913
| iso-8859-14    | iso8859-14, iso885914
| iso-8859-15    | csisolatin9, iso8859-15, iso885915, iso_8859-15, l9
| iso-8859-16    |
| koi8-r         | cskoi8r, koi, koi8, koi8_r
| koi8-u         | koi8-ru
| macintosh      | csmacintosh, mac, x-mac-roman
| windows-874    | dos-874, iso-8859-11, iso8859-11, iso885911, tis-620
| windows-1250   | cp1250, x-cp1250
| windows-1251   | cp1251, x-cp1251
| windows-1252   | ansi_x3.4-1968, ascii, cp1252, cp819, csisolatin1, ibm819, iso-8859-1, iso-ir-100, iso8859-1, iso88591, iso_8859-1, iso_8859-1:1987, l1, latin1, us-ascii, x-cp1252
| windows-1253   | cp1253, x-cp1253
| windows-1254   | cp1254, csisolatin5, iso-8859-9, iso-ir-148, iso8859-9, iso88599, iso_8859-9, iso_8859-9:1989, l5, latin5, x-cp1254
| windows-1255   | cp1255, x-cp1255
| windows-1256   | cp1256, x-cp1256
| windows-1257   | cp1257, x-cp1257
| windows-1258   | cp1258, x-cp1258
| x-mac-cyrillic | x-mac-ukrainian

[API Doc]: https://kayahr.github.io/text-encoding/
[GitHub]: https://github.com/kayahr/text-encoding
[NPM]: https://www.npmjs.com/package/@kayahr/text-encoding
