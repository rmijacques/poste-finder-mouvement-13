import logo from './logo.svg';
import { DataGrid } from '@mui/x-data-grid';
import { Box, FormControl, MenuItem, InputLabel, Select, Checkbox, ListItemText, OutlinedInput, Button, FormControlLabel } from '@mui/material';
import './App.css';
import dataSource from './data/postes13NinaCsv.csv';
import React, { useEffect } from 'react';
import { useState } from 'react';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 400,
    },
  },
};

const columns = [
  { filed: 'id', headerName: 'id' },
  { field: 'numPoste', headerName: 'numPoste' },
  { field: 'comune', headerName: 'Comune', width: 200 },
  { field: 'circo', headerName: 'Circo', width: 300 },
  { field: 'etablissement', headerName: 'Etablissement', width: 500 },
  { field: 'nature', headerName: 'Nature', width: 300 },
  { field: 'specialite', headerName: 'Spécilité', width: 300 },
  { field: 'nbClasses', headerName: 'Nb Classes' },
  { field: 'dontSpe', headerName: 'Dont spé' },
  { field: 'profilsInclus', headerName: 'Supports à profils inclus' },
  { field: 'nbSupportsTotal', headerName: 'Nb supports total' },
  { field: 'supportsInnac', headerName: 'Dont nb supports innacessibles' },
  { field: 'supportsVacants', headerName: 'Dont nb supports vacants' },
];

function App () {
  var [postes, setPostes] = React.useState([]);
  var [postesFiltres, setPostesFiltres] = React.useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedCircos, setSelectedCircos] = React.useState([]);
  const [differentCircos, setDifferentCircos] = React.useState([]);
  const [selectedNatures, setSelectedNatures] = React.useState([]);
  const [differentNatures, setDifferentNatures] = React.useState([]);
  const [postesDisposSeulement, setPostesDisposSeulement] = React.useState(false);


  const fromCsvToRow = (row, index) => {
    return {
      id: index,
      numPoste: row[0],
      comune: row[1],
      circo: row[2],
      etablissement: row[3],
      nature: row[4],
      specialite: row[5],
      nbClasses: row[6],
      dontSpe: row[7],
      profilsInclus: row[8],
      nbSupportsTotal: row[9],
      supportsInnac: row[10],
      supportsVacants: row[11]
    }
  }

  useEffect(() => {
    fetch(dataSource)
      .then((raw) => raw.text())
      .then((dataCsv) => {
        const splitted = dataCsv.split("\n");
        const dataReady = splitted.map(row => row.split(", "));
        const row = dataReady.map((row, index) => fromCsvToRow(row, index));
        setPostes(row);
        setPostesFiltres(row);


        let filteredCircos = row.map(r => r.circo).filter((value, index, array) => array.indexOf(value) === index);
        setDifferentCircos(filteredCircos);

        let filteredNatures = row.map(r => r.nature).filter((value, index, array) => array.indexOf(value) === index);
        setDifferentNatures(filteredNatures);

        setIsLoading(false);
      })
  }, [])

  const handleSelectedCircosChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCircos(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleSelectedNaturesChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedNatures(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handlePostesDispoSeulementChange = (event) => {
    setPostesDisposSeulement(event.target.checked);
  }

  const applyFilters = () => {
    let filtered = [...postes];
    if (selectedCircos && selectedCircos.length > 0) {
      filtered = filtered.filter(r => selectedCircos.includes(r.circo));
    }

    if (selectedNatures && selectedNatures.length > 0) {
      filtered = filtered.filter(r => selectedNatures.includes(r.nature));
    }

    if (postesDisposSeulement) {
      filtered = filtered.filter(r => parseInt(r.supportsVacants) >= 1);
    }
    setPostesFiltres(filtered);
  }


  return (
    <div className="App">
      <div class="form-container">
        <FormControl sx={{ m: 1, width: 400 }}>
          <InputLabel id="demo-multiple-checkbox-label">Circonscriptions affichées</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={selectedCircos}
            onChange={handleSelectedCircosChange}
            input={<OutlinedInput label="Circonscriptions affichées" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {differentCircos.map((circo) => (
              <MenuItem key={circo} value={circo}>
                <Checkbox checked={selectedCircos.indexOf(circo) > -1} />
                <ListItemText primary={circo} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, width: 400 }}>
          <InputLabel id="demo-multiple-checkbox-label">Natures affichées</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={selectedNatures}
            onChange={handleSelectedNaturesChange}
            input={<OutlinedInput label="Natures affichées" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {differentNatures.map((nature) => (
              <MenuItem key={nature} value={nature}>
                <Checkbox checked={selectedNatures.indexOf(nature) > -1} />
                <ListItemText primary={nature} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          label="Postes libres uniquement"
          control={
            <Checkbox
              label="Avec des postes disponibles uniquement"
              checked={postesDisposSeulement}
              onChange={handlePostesDispoSeulementChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          }
        />
        <Button variant="contained" onClick={applyFilters}>Appliquer les filtres</Button>
      </div>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={postesFiltres}
          isLoading={isLoading}
          columns={columns}
          pageSize={5}
          key="id"
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </Box>
    </div>

  );
}

export default App;
