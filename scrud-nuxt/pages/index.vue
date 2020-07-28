<template>
  <div id="app">
    <ul>
      <li><nuxt-link to="/test1">Test1</nuxt-link></li>
      <scrudTest :schema="test1"></scrudTest>
    </ul>
  </div>
</template>

<script id="dynamicJSONLD" type="application/ld+json">

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import scrudTest from '~/components/scrudTest.vue'

export default {
  name: "App",
  components: {
    scrudTest
  },
  created () {
    this.populateData
  },
  data () {
    return{
      test1: {
        "@context":"http://schema.org",
        "@type": "BlogPosting",
        "image": "http://example.com/images/image.jpg",
        "url": "http://example.com/blog/post",
        "headline": "My love of cats explained",
        "alternativeHeadline": "An indepth article on why I love cats",
        "dateCreated": "2019-02-11T11:11:11",
        "datePublished": "2019-02-11T11:11:11",
        "dateModified": "2019-02-11T11:11:11",
        "inLanguage": "en-US",
        "isFamilyFriendly": "true",
        "copyrightYear": "2019",
        "copyrightHolder": "",
        "contentLocation": {
          "@type": "Place",
          "name": "Delray Beach, FL"
        },
        "accountablePerson": {
          "@type": "Person",
          "name": "Patrick Coombe",
          "url": "https://patrickcoombe.com"
        },
        "author": {
          "@type": "Person",
          "name": "Patrick Coombe",
          "url": "https://patrickcoombe.com"
        },
        "creator": {
          "@type": "Person",
          "name": "Patrick Coombe",
          "url": "https://patrickcoombe.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Patrick Coombe",
          "url": "https://patrickcoombe.com",
          "logo": {
            "@type": "ImageObject",
            "url": "http://www.example.com/logo.png",
            "width":"400",
            "height":"55"
          }
        },
        "sponsor": {
          "@type": "Organization",
          "name": "Acme Widgets",
          "url": "https://example.com",
          "logo": {
            "@type": "ImageObject",
            "url": "http://www.example.com/logo.png"
          }
        },
        "mainEntityOfPage": "True",
        "keywords": [
          "keyword1",
          "keyword2",
          "keyword3",
          "keyword4"
        ],
        "genre":["SEO","JSON-LD"],
        "articleSection": "Uncategorized posts",
        "articleBody": "Paste the body of your content in here in plaintext"
      },
      test2: {
        "@context": "https://schema.org", 
        "@type": "BlogPosting",
        "headline": "14 Ways Json Can Improve Your SEO",
        "alternativeHeadline": "and the women who love them",
        "image": "http://example.com/image.jpg",
        "award": "Best article ever written",
        "editor": "John Doe", 
        "genre": "search engine optimization", 
        "keywords": "seo sales b2b", 
        "wordcount": "1120",
        "publisher": "Book Publisher Inc",
        "url": "http://www.example.com",
        "datePublished": "2015-09-20",
        "dateCreated": "2015-09-20",
        "dateModified": "2015-09-20",
        "description": "We love to do stuff to help people and stuff",
        "articleBody": "You can paste your entire post in here, and yes it can get really really long.",
        "author": {
          "@type": "Person",
          "name": "Steve"
        }
      }
    };
  },
  methods: {
  }
};
</script>
