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
#### Getting first elements of list of tuples
```python
list(zip(*list_of_tuples))[0]
```

#### Flat list
```python
flat_list = [x for xs in xss for x in xs]
```

#### Merge dictionaries
```python
a = {'s':1, 'f':5}
b = {'d':8, 'g':7, 'f':3}
c = {**a, **b} #{'d':8,'f':3,'g':7,'s':1}
```

#### Sort dictionaries
```python
a = {'h':4,'j':2,'a':8,'b':1}
b = sorted(a.items(), key=lambda x: x[1])
```

## pandas
### Filtering
#### Filter nulls in a specific column
```python
iowa_tweets_geo_df = combined_tweets_df[~combined_tweets_df['geo'].isna()]
```
### Merge
```python
links_df = pd.merge(left=links_df, right=combined_users_df[['id', 'name']], left_on="in_reply_to_user_id", right_on="id")
```
### Concat
```python
combined_users_df = pd.concat([abortion_users_df, near_iowa_users_df, roevwade_users_df]).drop(['Unnamed: 0'], axis=1, errors='ignore').drop_duplicates(subset=['description','created_at'], keep='last')
```

## visualizing
### plot confusion matrix
```python
# Helper function to create Confusion Matrix
import matplotlib.pyplot as plt
import seaborn as sns
def plot_cm(y_test, y_pred, period:int, labels):
  # cm_df = confusion_matrix(y_test, y_pred)
  cm_df = pd.crosstab(labels[y_test],labels[y_pred])
  #Plotting the confusion matrix
  plt.figure(figsize=(12,10))
  sns.heatmap(cm_df, annot=True, fmt='g')
  plt.title(f'Confusion Matrix - {period}sec')
  plt.ylabel('Actual Values')
  plt.xlabel('Predicted Values')
  plt.show()

y, labels = pd.factorize(df[taget_class], sort=True)
```

## ML
### RF/XGB
```python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import confusion_matrix

def get_clf_and_predictions(df:pd.DataFrame, taget_class:str, model:str, estimators=100, depth=None):

  # Fitting Random Forest Classification to the Training set
  if model == 'RF':
    clf = RandomForestClassifier(n_estimators = estimators, criterion = 'entropy',max_depth = depth, random_state = 101)
  elif model == 'XGB':
    clf = XGBClassifier()
  else:
    raise NotImplementedError

  # Removing the index and label 'class_name' columns
  X = df.drop(['category_name', 'class_name'], axis=1, errors='ignore')
  
  # Identify the target to predict
  y, labels = pd.factorize(df[taget_class], sort=True)
  
  # Split the train (75%) and test (25%)
  X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.25, random_state = 101)

  # Feature Scaling
  scaler = StandardScaler()
  X_train = scaler.fit_transform(X_train)
  X_test = scaler.transform(X_test)

  clf.fit(X_train, y_train)
  y_pred = clf.predict(X_test)
  return clf, y_test, y_pred, scaler, labels

clf, y_test, y_pred, scaler, labels = get_clf_and_predictions(combined_datasets_england[f'all_{period}'], taget_class='class_name', model='RF')
plot_cm(y_test, y_pred, period, labels)
```