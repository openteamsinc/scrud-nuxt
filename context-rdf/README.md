# rdf-context

### Examples

#### Supertype lookup

```javascript
const RdfContext = require('./index.js').RdfContext;

const rdfContext = new RdfContext();

// Return type: Promise<Array>
rdfContext.supertypes('http://api.example.com/json-ld/foo')
    .then(response => console.log)
```

##### Input

```json
From: http://api.example.com/json-ld/foo

  {
    "@context": "https://schema.org",
    "@type": "Person",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Colorado Springs",
      "addressRegion": "CO",
      "postalCode": "80840",
      "streetAddress": "100 Main Street"
    },
    "colleague": [
      "http://www.example.com/JohnColleague.html",
      "http://www.example.com/JameColleague.html"
    ],
    "email": "info@example.com",
    "image": "janedoe.jpg",
    "jobTitle": "Research Assistant",
    "name": "Jane Doe",
    "birthPlace": "Philadelphia, PA",
    "birthDate": "1979-10-12",
    "height": "72 inches",
    "gender": "female",
    "url": "http://www.example.com"
  }
```

##### Output

```javascript
[ 'http://schema.org/PostalAddress', 'http://schema.org/Person' ]
```
