const createTablePeopleQuery =  
`CREATE TABLE public.person (
	person_id uuid NOT NULL DEFAULT gen_random_uuid(),
	person_name varchar(255) NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT tbl_person_pk PRIMARY KEY (person_id),
    CONSTRAINT tbl_person_un UNIQUE (person_name),
)`

const createTablePetQuery =  
`CREATE TABLE IF NOT EXISTS public.pet (
	pet_id uuid NOT NULL DEFAULT gen_random_uuid(),
	pet_name varchar(255) NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	pet_type tx_type_list not NULL,
	CONSTRAINT tbl_pet_pk PRIMARY KEY (pet_id),
)`

const getPeoplesAndPetsQuery = 
`SELECT
    p.person_name,
    pe.pet_name,
    pe.pet_type
FROM person p
LEFT JOIN pet pe ON p.person_id = pe.pet_id
GROUP BY p.person_name`


export { createTablePeopleQuery, createTablePetQuery, getPeoplesAndPetsQuery }