# kanoru-movie-api

## Create migration
```npm run migration:create --name=create-user-table```

## Generate migration
```npm run migrate:generate --name=name-changes```

!!!!  **IMPORTANT**  !!!!

Need import like this ```import Movie from "./Movie";``` 


## Run scripts for updates
**MOVIES**

```npx ts-node src/scripts/getUpdatesForMovies.ts --startDate="2023-05-01" --endDate="2023-05-09"```

