import { Box, Grid, Pagination } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import Meta from "../../components/Meta";
import CharacterCard from "../../components/pages/characters/CharacterCard";
import { getCharacters } from "../../lib/characters";

const Characters = ({ characters }) => {
  const router = useRouter();
  const [page, setPage] = useState(parseInt(router.query.page) || 1);
  const { data, meta, errors } = characters;

  const handlePaginationChange = (_event, page) => {
    setPage(page);
    const currentPath = router.pathname;
    const currentQuery = router.query;
    currentQuery.page = page;
    router.push({ pathname: currentPath, query: currentQuery });
  };

  const stats = meta && (
    <>
      <p>Total characters: {meta.pagination.records}</p>
      <p>Current page: {meta.pagination.current}</p>
      <p>Next page: {meta.pagination.next}</p>
      <p>Last page: {meta.pagination.last}</p>
      {data && <p>Characters on current page: {data.length}</p>}
    </>
  );

  const metaDescription = `List of all Harry Potter characters - ${
    meta ? `Total: ${meta.pagination.records}` : ""
  }`;

  return (
    <>
      <Meta title="Characters" description={metaDescription} />
      <h1>Welcome to the Harry Potter Character List</h1>
      {stats}

      {data && (
        <Grid container spacing={5} sx={{ mt: 1 }} alignItems="stretch">
          {data.map((character) => (
            <CharacterCard
              key={character.id}
              id={character.id}
              attributes={character.attributes}
            />
          ))}
        </Grid>
      )}

      {!data && <p>No characters available!</p>}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={meta?.pagination.last}
          page={page}
          onChange={handlePaginationChange}
          size="large"
        />
      </Box>
    </>
  );
};

export async function getServerSideProps({ query }) {
  const page = query.page;
  const characters = await getCharacters(page);

  return {
    props: {
      characters,
    },
  };
}

export default Characters;