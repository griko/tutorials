# Colab snippets

## Download file from colab
```python
from google.colab import files
files.download('data.zip') 
```
## Zip/unzip
`!zip -r data.zip $preprocessed_dirname`

`!unzip -q place1.zip`

## Get file from google drive
`!wget -O place2.zip "https://drive.google.com/uc?export=download&confirm=9iBg&id=<id>"`

## python
### Getting first elements of list of tuples
`list(zip(*list_of_tuples))[0]`

### Flat list
`flat_list = [x for xs in xss for x in xs]`

## pandas
### Filtering
#### Filter nulls in a specific column
`iowa_tweets_geo_df = combined_tweets_df[~combined_tweets_df['geo'].isna()]`
### Merge
`links_df = pd.merge(left=links_df, right=combined_users_df[['id', 'name']], left_on="in_reply_to_user_id", right_on="id")`
### Concat
`combined_users_df = pd.concat([abortion_users_df, near_iowa_users_df, roevwade_users_df]).drop(['Unnamed: 0'], axis=1, errors='ignore').drop_duplicates(subset=['description','created_at'], keep='last')`

