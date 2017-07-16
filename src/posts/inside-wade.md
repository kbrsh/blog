---
title: Inside Wade
date: July 16, 2017
order: 4
---

[Wade](https://github.com/KingPixil/wade) is a 1kb Javascript search library. It allows you to create a function that can search an array of strings for a set of keywords, which is run through the processor. After this, it is searched for in each item of the data.

### API

The API is extremely minimal and self-explanatory. It looks like:

```js
const search = Wade(["He saves on socks.", "You are being silly."]);
search("save socks");
```

### Preprocessor

Wade preprocesses all data to search for, and any search queries. This works by moving each item through a pipeline. This will do the following operations:

* Make everything lowercase.
  This helps with searching. All queries and data are made lowercase, resulting in the search not being case-sensitive.
* Remove punctuation.
  Punctuation is an extra item to be searched for, and removing it allows for efficient searches.
* Remove stop words.
  Wade has a list of stop words that are removed from all data and queries. Stop words are extra words that have little meaning or can apply to any item in the data, and removing them allows for more relevant results to be returned.

### Search

When you first give Wade an array of data, it will create a [trie](https://en.wikipedia.org/wiki/Trie) representing all indexes of the data.

The best way to understand how this works, is to use an example. Say that the data given looks like:

```js
["Hey", "Hello", "Greetings"]
```

After preprocessing, the data will look like:

```js
["hey", "hello", "greetings"]
```

The generated trie for this will have a reference to which indexes the item belongs in the data:

```js
{
  "h": {
    "e": {
      "y": {
        "indexes": [0]
      },
      "l": {
        "l": {
          "o": {
            "indexes": [1]
          }
        }
      }
    }
  },
  "g": {
    "r": {
      "e": {
        "e": {
          "t": {
            "i": {
              "n": {
                "g": {
                  "s": {
                    "indexes": [2]
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

As you can see, the trie will make a single data structure representing all of the strings. Whenever a node has had the content of a string so far, it will contain an `indexes` property holding the indexes in the data that the node refers to.

This data structure can take some time to generate, but searching through it is a breeze.

Say we would like to search for `"he"`. Wade will split this into keywords, and search for each of them in the trie individually, updating the score for the indexes as it goes.

Since there is only one keyword, Wade will treat it **as a prefix**, meaning that it will perform a [depth-first search](https://en.wikipedia.org/wiki/Depth-first_search).

This works by traveling as far down the trie as possible, and then grabbing the index of itself and _every_ node under it.

Let's go through this step by step. Wade will go through the keyword one by one, and see if it is in the trie.

1. The current character is `"h"`, it is inside of the trie, set the current node to it and continue.
2. The current character is `"e"`, set the current node to it.
3. We have arrived at the end of the keyword, check all nodes below.
4. Search `"y"`.
   The node has an `indexes` property, increment the score for the index inside (`[0]`).
5. Traverse through `"e"`, `"l"`, `"l"`, and `"o"`.
   The node has an `indexes` property, increment the score for the index inside (`[1]`).
6. Nothing left, abort the search.

In the end, we will be left with a `results` array like:

```js
[1, 1]
```

We can see that we have returned the results for:

```js
["Hey", "Hello"]
```

These both do indeed have the prefix of `"he"`, which means we have successfully performed a search! For keyword that aren't treated as prefixes, Wade will not perform a depth-first search, and will increment the score for any indexes found if the whole keyword was matched. The last keyword of a query will be treated as a prefix, as the user might still be typing.

### Conclusion

That is how Wade works! In a nutshell, it preprocesses data, splits it into keywords, and searches within a trie.

Be sure to check out the source on [Github](https://github.com/KingPixil/wade)
