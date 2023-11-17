const dir_character = "https://rickandmortyapi.com/api/character";
const dir_location = "https://rickandmortyapi.com/api/location";
const dir_episode = "https://rickandmortyapi.com/api/episode";

class ApiInterface extends Interface
{
    constructor(props)
    {
        super();
        /**
         * @type { Array.<number> }
         */
        this.episodes = [];
        this.id_location = 0;

        this.dir_character = dir_character;
        this.dir_location = dir_location;
        this.dir_episode = dir_episode;

        Object.assign(this, props);

        console.log('Api Interface');
        console.log(this);
    }
    async GetCharacters ()
    {
        let res = JSON.parse
        ( 
            await async_cmd
            (
                'get'
                ,
                this.dir_character
            )
        )

        //console.log(res);

        /**
         * @type { Array.<CharacterModel> }
         */
        let chars = [];
        for(let i = 1; i <= res.info.count; i++)
        {
            Cmd
            (
                function(c)
                {
                    chars.push(JSON.parse(c));
                }
                ,
                'get'
                ,
                this.dir_character + `/${i}`
            );
        }
        return new Promise
        (
            function(callback)
            {
                let id = setInterval
                (
                    function(cancel)
                    {
                        if(chars.length < res.info.count)
                        {

                        }
                        else
                        {
                            clearInterval(id);
                            console.log('Characters Loaded!')
                            callback(chars);
                        }
                    }
                    ,
                    1000
                )
            }
        )
    }
    /**
     * 
     * @param {number} id_location 
     * @param {Array.<CharacterModel>} chars 
     */
    async GetByIdLocation(id_location, chars)
    {
        let filter = chars.filter
        (
            (n) => 
            {
                return n.location.url == this.dir_location + `/${id_location}`
                ||
                n.location.name.startsWith(id_location)
                ;
            }
        )
        
        let b = parseInt(id_location);
        if(b)
        {
            let id = b;
            console.log('por id');
            console.log(id);
            if(id < 50)
            {
                document.body.style.setProperty('background-color', 'green');
            }
            else if(id >= 50 && id < 80)
            {
                document.body.style.setProperty('background-color', 'blue');
            }
            else if(id >= 80)
            {
                document.body.style.setProperty('background-color', 'red');
            }
        }
        else
        {
            console.log('por texto');
            let res = 
            JSON.parse
            (
                await async_cmd
                (
                    'get'
                    ,
                    `https://rickandmortyapi.com/api/location/?name=${id_location}`
                )
            );
            let id = res.results[0].id;
            console.log('id:');
            console.log(id);
            if(id < 50)
            {
                document.body.style.setProperty('background-color', 'green');
            }
            else if(id >= 50 && id < 80)
            {
                document.body.style.setProperty('background-color', 'blue');
            }
            else if(id >= 80)
            {
                document.body.style.setProperty('background-color', 'red');
            }
        }
        return filter;
    }
    /**
     * 
     * @param {number} episode 
     * @param {Array.<CharacterModel>} chars 
     */
    async GetByEpisode(episode, chars)
    {
        let filter = chars.filter
        (
            (n) => 
            {
                return n.episode.includes(this.dir_episode + `/${episode}`);
            }
        );
        return filter;
    }
    async GroupByEpisodes()
    {
        let r = {};
        let chars = await this.GetCharacters();
        chars = await this.GetByIdLocation(this.id_location, chars);

        console.log(`ByIdLocation:`);
        console.log(chars);

        if(this.episodes.length == 0)
        {
            let epi_res = 
            JSON.parse
            (
                await async_cmd
                (
                    'get'
                    ,
                    'https://rickandmortyapi.com/api/episode'
                )
            )
            for(let i = 1; i <= epi_res.info.count; i++)
            {
                this.episodes.push(i);   
            }
        }

        for(let i = 0; i < this.episodes.length; i++)
        {
            let episode = this.episodes[i];
            console.log('episode:');
            console.log(episode);
            let epi =  
            JSON.parse
            (
                await async_cmd
                (
                    'get'
                    ,
                    `https://rickandmortyapi.com/api/episode/${episode}`
                )
            )
            r[`episode ${episode} (${epi.name})`] = await this.GetByEpisode(episode, chars);
        }
        return r;
    }
    async GetLocationName (id_location)
    {
        let res = JSON.parse
        ( 
            await async_cmd
            (
                'get'
                ,
                this.dir_location + `/${id_location}`
            )
        )
        return res.name;
    }
    /**
     * 
     * @param { CharacterModel } character 
     */
    async GetEpisodesNames (character)
    {
        let r = [];
        character.episode.forEach
        (
            async function(n)
            {
                let episode = 
                JSON.parse
                (
                    await async_cmd
                    (
                        'get'
                        ,
                        n
                    )
                )
                r.push(episode.name);
            }
        )
        return new Promise
        (
            function(callback)
            {
                let id = setInterval
                (
                    function(cancel)
                    {
                        if(r.length < character.episode.length)
                        {

                        }
                        else
                        {
                            clearInterval(id);
                            callback(r.sort());
                        }
                    }
                    ,
                    1000
                )
            }
        )
    }
}
class CharacterModel
{
    constructor()
    {
        /**
         * @type { number }
         */
        this.id = 0;
        /**
         * @type { String }
         */
        this.name = "";
        /**
         * @type { String }
         */
        this.status = "";
        /**
         * @type { String }
         */
        this.species = "";
        /**
         * @type { String }
         */
        this.type = "";
        /**
         * @type { String }
         */
        this.gender = "";
        this.origin = 
        {
            name:""
            ,
            url:""
        }
        this.location =
        {
            name:""
            ,
            url:""
        }
        /**
         * @type { String }
         */
        this.image = "";
        /**
         * @type { Array.<String> }
         */
        this.episode = [];
        
        /**
         * @type { String }
         */
        this.url = "";
        /**
         * @type { String | Date }
         */
        this.created = "";
    }
}