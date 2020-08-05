import {cachingClient} from '../src/index';

describe('caching-client', () => {
    it('Check GET request', async () => {
        expect(_caches['read-through-cache-v1']).toBeUndefined();
        const expected = [{'completed': false, 'id': 1, 'title': 'delectus aut autem', 'userId': 1}, {'completed': false, 'id': 2, 'title': 'quis ut nam facilis et officia qui', 'userId': 1}, {'completed': false, 'id': 3, 'title': 'fugiat veniam minus', 'userId': 1}, {'completed': true, 'id': 4, 'title': 'et porro tempora', 'userId': 1}, {'completed': false, 'id': 5, 'title': 'laboriosam mollitia et enim quasi adipisci quia provident illum', 'userId': 1}, {'completed': false, 'id': 6, 'title': 'qui ullam ratione quibusdam voluptatem quia omnis', 'userId': 1}, {'completed': false, 'id': 7, 'title': 'illo expedita consequatur quia in', 'userId': 1}, {'completed': true, 'id': 8, 'title': 'quo adipisci enim quam ut ab', 'userId': 1}, {'completed': false, 'id': 9, 'title': 'molestiae perspiciatis ipsa', 'userId': 1}, {'completed': true, 'id': 10, 'title': 'illo est ratione doloremque quia maiores aut', 'userId': 1}, {'completed': true, 'id': 11, 'title': 'vero rerum temporibus dolor', 'userId': 1}, {'completed': true, 'id': 12, 'title': 'ipsa repellendus fugit nisi', 'userId': 1}, {'completed': false, 'id': 13, 'title': 'et doloremque nulla', 'userId': 1}, {'completed': true, 'id': 14, 'title': 'repellendus sunt dolores architecto voluptatum', 'userId': 1}, {'completed': true, 'id': 15, 'title': 'ab voluptatum amet voluptas', 'userId': 1}, {'completed': true, 'id': 16, 'title': 'accusamus eos facilis sint et aut voluptatem', 'userId': 1}, {'completed': true, 'id': 17, 'title': 'quo laboriosam deleniti aut qui', 'userId': 1}, {'completed': false, 'id': 18, 'title': 'dolorum est consequatur ea mollitia in culpa', 'userId': 1}, {'completed': true, 'id': 19, 'title': 'molestiae ipsa aut voluptatibus pariatur dolor nihil', 'userId': 1}, {'completed': true, 'id': 20, 'title': 'ullam nobis libero sapiente ad optio sint', 'userId': 1}];
        const url = 'https://jsonplaceholder.typicode.com/users/1/todos';
        const request = await cachingClient.get(url, true);
        expect(request).toEqual(expected);
        expect(_caches['read-through-cache-v1']).not.toBeUndefined();
        expect(_caches['read-through-cache-v1'][url]).not.toBeUndefined();
   })
});
