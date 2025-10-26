import plotly.graph_objects as go
import pandas as pd

# Create the figure
fig = go.Figure()

# Define positions for horizontal flow layout
components = [
    {"name": "Input", "desc": "PDF/LaTeX<br>Paper", "x": 100, "y": 300},
    {"name": "Doc Process", "desc": "PDF→XML<br>Text Extract", "x": 250, "y": 300},
    {"name": "NLP Analysis", "desc": "Sentence<br>Salience", "x": 400, "y": 400},
    {"name": "Content Cluster", "desc": "ILP Optim<br>Similarity", "x": 400, "y": 300},
    {"name": "Visual Detect", "desc": "Figure/Table<br>Identify", "x": 400, "y": 200},
    {"name": "Layout Gen", "desc": "Slide Struct<br>Template", "x": 550, "y": 300},
    {"name": "Output", "desc": "Generated<br>Slides", "x": 700, "y": 300}
]

# Define colors for different stages
colors = ['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F', '#D2BA4C', '#B4413C', '#964325']

# Add rectangles for each component
for i, comp in enumerate(components):
    fig.add_shape(
        type="rect",
        x0=comp["x"]-40, y0=comp["y"]-30,
        x1=comp["x"]+40, y1=comp["y"]+30,
        fillcolor=colors[i],
        line=dict(color="white", width=2)
    )
    
    # Add text labels
    fig.add_annotation(
        x=comp["x"], y=comp["y"],
        text=f"<b>{comp['name']}</b><br>{comp['desc']}",
        showarrow=False,
        font=dict(color="white", size=11),
        align="center"
    )

# Add flow arrows with technology labels
arrows = [
    # Input → Doc Process
    {"x0": 140, "y0": 300, "x1": 210, "y1": 300, "label": "Upload", "label_y": 285},
    # Doc Process → NLP Analysis  
    {"x0": 290, "y0": 320, "x1": 360, "y1": 380, "label": "ML Models", "label_y": 350},
    # Doc Process → Content Cluster
    {"x0": 290, "y0": 300, "x1": 360, "y1": 300, "label": "Text Stream", "label_y": 285},
    # Doc Process → Visual Detect
    {"x0": 290, "y0": 280, "x1": 360, "y1": 220, "label": "Parsing", "label_y": 250},
    # NLP Analysis → Layout Gen
    {"x0": 440, "y0": 380, "x1": 510, "y1": 320, "label": "Scores", "label_y": 350},
    # Content Cluster → Layout Gen
    {"x0": 440, "y0": 300, "x1": 510, "y1": 300, "label": "Groups", "label_y": 285},
    # Visual Detect → Layout Gen
    {"x0": 440, "y0": 220, "x1": 510, "y1": 280, "label": "Elements", "label_y": 250},
    # Layout Gen → Output
    {"x0": 590, "y0": 300, "x1": 660, "y1": 300, "label": "Render", "label_y": 285}
]

# Add arrows and labels
for arrow in arrows:
    # Add arrow line
    fig.add_shape(
        type="line",
        x0=arrow["x0"], y0=arrow["y0"],
        x1=arrow["x1"], y1=arrow["y1"],
        line=dict(color="#333", width=3)
    )
    
    # Add arrowhead
    dx = arrow["x1"] - arrow["x0"]
    dy = arrow["y1"] - arrow["y0"]
    length = (dx**2 + dy**2)**0.5
    
    # Normalize direction
    dx_norm = dx / length
    dy_norm = dy / length
    
    # Arrow tip coordinates
    tip_x = arrow["x1"]
    tip_y = arrow["y1"]
    
    # Arrow base coordinates (offset back from tip)
    base_x = tip_x - 8 * dx_norm
    base_y = tip_y - 8 * dy_norm
    
    # Arrow wing coordinates
    wing1_x = base_x - 5 * dy_norm
    wing1_y = base_y + 5 * dx_norm
    wing2_x = base_x + 5 * dy_norm
    wing2_y = base_y - 5 * dx_norm
    
    # Add arrowhead as filled polygon
    fig.add_shape(
        type="path",
        path=f"M {tip_x},{tip_y} L {wing1_x},{wing1_y} L {wing2_x},{wing2_y} Z",
        fillcolor="#333",
        line=dict(color="#333")
    )
    
    # Add technology label
    label_x = (arrow["x0"] + arrow["x1"]) / 2
    fig.add_annotation(
        x=label_x, y=arrow["label_y"],
        text=arrow["label"],
        showarrow=False,
        font=dict(color="#666", size=9),
        bgcolor="white",
        bordercolor="#666",
        borderwidth=1
    )

# Update layout
fig.update_layout(
    title="Scientific Paper to Slide Generator",
    xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
    yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
    plot_bgcolor='white',
    paper_bgcolor='white',
    showlegend=False
)

# Set axis ranges
fig.update_xaxes(range=[50, 750])
fig.update_yaxes(range=[150, 450])

# Save the chart
fig.write_image("workflow_diagram.png", width=900, height=500)