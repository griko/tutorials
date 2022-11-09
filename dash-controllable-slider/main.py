from dash import Dash, dcc, html, Input, Output, State
import plotly.express as px
import plotly.graph_objects as go

app = Dash(__name__)

df = px.data.gapminder()
frames=[go.Frame(name=str(n), data=go.Scatter(y=df[df['year'] == n]['lifeExp']))
        for n in list(df['year'].unique())]
fig = go.Figure(data=frames[0].data, frames=frames)
app.layout = html.Div([
    html.H4('Animated GDP and population over decades'),
    html.P("Select an animation:"),
    dcc.RadioItems(
        id='selection',
        options=["GDP - Scatter", "Population - Bar"],
        value='GDP - Scatter',
    ),
    # dcc.Graph(id="graph"),
    html.Button("Play", id="dashPlay", n_clicks=0),
    dcc.Graph(id="graph2", figure=fig),
    dcc.Slider(id="dashSlider", min=0, max=len(frames)-1, value=0, marks={i:{"label":str(i)} for i in range(len(frames))}),
    dcc.Interval(id="animateInterval", interval=400, n_intervals=0, disabled=False),
    dcc.Store(id="selection_lag", data='GDP - Scatter')
    # dcc.Loading([, ], type="cube")
])

# start / stop Interval to move through frames
@app.callback(
    Output("animateInterval","disabled"),
    Input("dashPlay", "n_clicks"),
    State("animateInterval","disabled"),
)
def play(n_clicks, disabled):
    return not disabled

@app.callback(
    Output("dashSlider", "value"),
    Output("selection_lag", "data"),
    Input("animateInterval", "n_intervals"),
    Input("selection", "value"),
    Input("selection_lag", "data"),
    State("dashSlider", "value"),
    # State("selection_lag", "data"),
)
def doAnimate(i, sel, sel_lag, frame):
    if sel != sel_lag:
        sel_lag = sel
        frame = 0
        return frame, sel_lag
    if frame < (len(frames)-1):
        frame += 1
    else:
        frame = 0
    return frame, sel_lag

@app.callback(
    # Output("whichframe", "children"),
    Output("graph2", "figure"),
    Input("dashSlider", "value"),
)
def setFrame(frame):
    if frame:
        tfig = go.Figure(fig.frames[frame].data, frames=fig.frames, layout=fig.layout)
        try:
            tfig.layout['sliders'][0]['active'] = frame
        except IndexError:
            pass
        return tfig #frame, tfig
    else:
        return fig # 0, fig

# @app.callback(
#     Output("dashSlider", "value"),
#     Input("selection", "value"))
# def display_animated_graph(selection):
#     return 0

# @app.callback(
#     Output("graph", "figure"),
#     Input("selection", "value"))
# def display_animated_graph(selection):
#      # replace with your own data source
#     animations = {
#         'GDP - Scatter': px.scatter(
#             df, x="gdpPercap", y="lifeExp",
#             size="pop", color="continent",
#             hover_name="country", log_x=True, size_max=55,
#             range_x=[100,100000], range_y=[25,90]),
#         'Population - Bar': px.bar(
#             df, x="continent", y="pop", color="continent",
#             range_y=[0,4000000000]),
#     }
#     fig = animations[selection]
#     # fig.layout['sliders'][0]['active'] = 1
#     # fig = go.Figure(data=fig['frames'][-1]['data'], frames=fig['frames'], layout=fig.layout)
#     # fig2 = go.Figure()
#     # # add last frame traces to fig2
#     # for tr in fig.frames[-1].data:
#     #     fig2.add_trace(tr)
#     # # copy the layout
#     # fig2.layout = fig.layout
#     # #  copy the frames
#     # fig2.frames = fig.frames
#     # # set last frame as the active one
#     # fig2.layout['sliders'][0]['active'] = 0  # len(fig.frames) - 1
#
#     return fig


app.run_server(debug=True)