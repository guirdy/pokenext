import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'
import { ChangeEvent, useState } from 'react'
import { Pokemon, PokemonList } from '../types/Pokemon'
import { pokeAPI } from './api/api'

export const getStaticProps: GetStaticProps = async () => {
  const res = await pokeAPI.get('pokemon?limit=100000&offset=0')
  const pokemonList: PokemonList = res.data

  return { props: { pokemonList }, revalidate: 60 }
}

const Home: NextPage = ({
  pokemonList,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // States
  const [search, setSearch] = useState('')
  const [listSize, setListSize] = useState(20)

  const pokemonFilteredList: Pokemon[] = pokemonList.results.filter(
    (pokemon: Pokemon) => pokemon.name.includes(search)
  )

  const showMorePokemons = (sum: number) => {
    if (sum === pokemonList.count) return

    if (sum > pokemonList.count) {
      setListSize(pokemonList.count)
      return
    }

    setListSize(sum)
  }

  if (!pokemonList) {
    return <p>An error has occurred to load the pokemon list...</p>
  }

  return (
    <>
      <Head>
        <title>PokeNext</title>
      </Head>

      <article>
        <input
          type='text'
          name='pokemonSearch'
          id='pokemonSearch'
          placeholder='Busque pelo nome'
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
        <p>Total: {pokemonList.count}</p>
      </article>
      <section>
        {pokemonFilteredList
          .slice(0, listSize)
          .map((pokemon: Pokemon, index: number) => (
            <pre className='mb-2 bg-gray-100'>{pokemon.name}</pre>
          ))}
        <button onClick={() => showMorePokemons(listSize + 20)}>
          Show More
        </button>
      </section>
    </>
  )
}

export default Home