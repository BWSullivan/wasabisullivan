def generate_html(filenames):
    template = """
    <a href="/images/japan/full/{filename}" data-fancybox="gallery">
        <img src="/images/japan/thumb/{filename}" alt="Description">
    </a>
"""

    html_entries = [template.format(filename=f) for f in filenames]
    return '<div class="image-grid">\n' + '\n'.join(html_entries) + '\n</div>'

if __name__ == "__main__":
    filenames = [
        "A7R01345.jpg",
        "A7R01358.jpg",
        "A7R01362.jpg",
        "A7R01381.jpg",
        "A7R01383.jpg",
        "A7R01389.jpg",
        "A7R01390.jpg",
        "A7R01395.jpg",
        "A7R01398.jpg",
        "A7R01406.jpg",
        "A7R01411.jpg",
        "A7R01412.jpg",
        "A7R01413.jpg",
        "A7R01419.jpg",
        "A7R01423.jpg",
        "A7R01425.jpg",
        "A7R01431.jpg",
        "A7R01436.jpg",
        "A7R01441.jpg",
        "A7R01479.jpg",
        "A7R01496.jpg",
        "A7R01501.jpg",
        "A7R01503.jpg",
        "A7R01519.jpg",
        "A7R01520.jpg",
        "A7R01525.jpg",
        "A7R01532.jpg",
        "A7R01536.jpg",
        "A7R01539.jpg",
        "A7R01544.jpg",
        "A7R01556.jpg",
        "A7R01576.jpg",
        "A7R01598.jpg",
        "A7R01604.jpg",
        "A7R01649.jpg",
        "A7R01652.jpg",
        "A7R01668.jpg",
        "A7R01741.jpg",
        "A7R01746.jpg",
        "A7R01757.jpg",
        "A7R01768.jpg",
        "A7R01774.jpg",
        "A7R01777.jpg",
        "A7R01802.jpg",
        "A7R01803.jpg",
        "A7R01809.jpg",
        "A7R01828.jpg",
        "A7R01847.jpg",
        "A7R01856.jpg",
        "A7R01873.jpg",
        "A7R01880.jpg",
        "A7R01885.jpg",
        "A7R01890.jpg",
        "A7R01906.jpg",
        "A7R01907.jpg",
        "A7R01909.jpg",
        "A7R01918.jpg",
        "A7R01920.jpg",
        "A7R01929.jpg",
        "A7R01945.jpg",
        "A7R01956.jpg",
        "A7R01967.jpg",
        "A7R01989.jpg",
        "A7R01997.jpg",
        "A7R01999.jpg",
        "A7R02006.jpg",
        "A7R02008.jpg",
        "A7R02026.jpg",
        "A7R02029.jpg",
        "A7R02033.jpg",
        "A7R02052.jpg",
        "A7R02070.jpg",
        "A7R02080.jpg"
    ]

    html_output = generate_html(filenames)
    with open("output.html", "w") as f:
        f.write(html_output)

    print("HTML written to output.html")
