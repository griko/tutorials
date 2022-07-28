# Populating pandas DataFrame
Say you want to process a DataFrame and collect the results by building a new DataFrame.
For example, we want to identify batches of consequent batches of rows with the same 'tcp.port' value.

To the origin df we may add

`df['batch_number'] = (df['tcp.srcport'] != df['tcp.srcport'].shift()).cumsum()`


## The concatenation (slow)

```python
for df_name, df in tqdm(dfs.items()):
  all_batches_df = pd.DataFrame()
  for i, g in tqdm(df.groupby(['batch_number'])):
      batch_start_time = g.iloc[0]['frame.time_epoch']
      ...
  batch_df = pd.DataFrame({"batch_start_time": [batch_start_time], "batch_duration": [batch_duration],
                               "batch_data_size": [batch_data_size], "batch_port": [batch_port],
                               "batch_is_incoming": [batch_is_incoming], "batch_number_of_packets": [batch_number_of_packets],
                               "batch_average_packet_size": [batch_average_packet_size], "class_name": [class_name]})
  all_batches_df = pd.concat([all_batches_df, batch_df])
```

## The last loc (slow)

```python
for df_name, df in tqdm(dfs.items()):
  all_batches_df = pd.DataFrame(columns=['batch_start_time', 'batch_duration',
                                          'batch_data_size', 'batch_port',
                                          'batch_is_incoming', 'batch_number_of_packets',
                                          'batch_average_packet_size', 'class_name'])
  for i, g in tqdm(df.groupby(['batch_number'])):
      batch_start_time = g.iloc[0]['frame.time_epoch']
      ...
  all_batches_df.loc[len(all_batches_df)] = [batch_start_time, batch_duration,
                                           batch_data_size, batch_port,
                                           batch_is_incoming, batch_number_of_packets,
                                           batch_average_packet_size, class_name]
```

## From records (fast, x5-x10)

```python
for df_name, df in tqdm(dfs.items()):
  all_batches_df = pd.DataFrame(columns=['batch_start_time', 'batch_duration',
                                          'batch_data_size', 'batch_port',
                                          'batch_is_incoming', 'batch_number_of_packets',
                                          'batch_average_packet_size', 'class_name'])
  records = []
  for i, g in tqdm(df.groupby(['batch_number'])):
      batch_start_time = g.iloc[0]['frame.time_epoch']
      ...
  records.append([batch_start_time, batch_duration,
                                          batch_data_size, batch_port,
                                          batch_is_incoming, batch_number_of_packets,
                                          batch_average_packet_size, class_name])
  all_batches_df = pd.DataFrame.from_records(records)
```



