select 'sumados', sum(datos) from
(select count(*) as datos from awards
union all
select count(*) as datos  from certificates
union all
select count(*) as datos  from educations
union all
select count(*) as datos from interests
union all
select count(*) as datos  from languages
union all
select count(*) as datos  from locations
union all
select count(*) as datos from profiles
union all
select count(*) as datos  from publications
union all
select count(*) as datos from skills 
union all
select count(*) as datos  from user_references
union all
select count(*) as datos  from volunteers
union all
select count(*) as datos  from works
union all
select count(*) as datos  from projects
)
union all
select 'sections', count(*)  from sections;


select 'awards', 'tabla', count(*) from awards
union all
select 'sumados', sum(datos) from
(select count(*) as datos from awards
union all
select count(*) as datos  from certificates
union all
select count(*) as datos  from educations
union all
select count(*) as datos from interests
union all
select count(*) as datos  from languages
union all
select count(*) as datos  from locations
union all
select count(*) as datos from profiles
union all
select count(*) as datos  from publications
union all
select count(*) as datos from skills 
union all
select count(*) as datos  from user_references
union all
select count(*) as datos  from volunteers
union all
select count(*) as datos  from works
union all
select count(*) as datos  from projects
union all
select count(*) as datos  from basics
)
union all
select 'sumados', sum(datos) from
(select 'sections', count(*) datos from sections
union all
select 'basics', count(*) as datos  from basics)
;

select 'awards', 'tabla', count(*) from awards
union all
select 'basics', 'tabla', count(*)  from basics
union all
select 'certificates', 'tabla', count(*)  from certificates
union all
select 'educations', 'tabla', count(*)  from educations
union all
select 'interests', 'tabla', count(*)  from interests
union all
select 'languages', 'tabla', count(*)  from languages
union all
select 'locations', 'tabla', count(*)  from locations
union all
select 'profiles', 'tabla', count(*)  from profiles
union all
select 'publications', 'tabla', count(*)  from publications
union all
select 'skills', 'tabla', count(*)  from skills 
union all
select 'references', 'tabla', count(*)  from user_references
union all
select 'volunteers', 'tabla', count(*)  from volunteers
union all
select 'works', 'tabla', count(*)  from works
union ALL
select 'projects', 'tabla', count(*)  from projects
union ALL
select sections.section_name, 'sections', count(*) from sections
group by sections.section_name
order by 1, 2;


select id from projects;
select sections.section_id from sections
where sections.section_name = 'projects';