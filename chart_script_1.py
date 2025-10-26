import plotly.express as px
import plotly.graph_objects as go
import pandas as pd

# Data for the NLP approaches performance
data = [
    {"approach": "Traditional OCR", "accuracy": 78.5},
    {"approach": "CNN-based", "accuracy": 87.3},
    {"approach": "RNN approaches", "accuracy": 89.1},
    {"approach": "Transformer models", "accuracy": 94.2},
    {"approach": "Hybrid CNN-Transformer", "accuracy": 96.1}
]

# Create DataFrame
df = pd.DataFrame(data)

# Shorten approach names to fit 15 character limit
df['approach_short'] = [
    "Trad OCR",
    "CNN-based", 
    "RNN",
    "Transformer",
    "Hybrid C-T"
]

# Define colors using the brand colors in order
colors = ['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F', '#D2BA4C']

# Create bar chart
fig = go.Figure(data=[
    go.Bar(
        x=df['approach_short'],
        y=df['accuracy'],
        marker_color=colors,
        text=[f'{acc}%' for acc in df['accuracy']],
        textposition='outside'
    )
])

# Update layout
fig.update_layout(
    title="NLP Approach Performance Comparison",
    xaxis_title="Approach",
    yaxis_title="Accuracy (%)",
    showlegend=False
)

# Update traces for better presentation
fig.update_traces(cliponaxis=False)

# Update y-axis to show percentage range appropriately
fig.update_yaxes(range=[70, 100])

# Save the chart
fig.write_image("nlp_performance_comparison.png")